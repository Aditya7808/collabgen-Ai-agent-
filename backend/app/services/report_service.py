"""
Report Service - Manages report storage, retrieval, and lifecycle.
Handles file operations with proper security measures.
"""
import asyncio
import json
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import aiofiles
import aiofiles.os

from app.config import get_settings
from app.models.responses import (
    PipelineResponse,
    ReportDetail,
    ReportSummary,
    SectionStatus,
    PipelineSections,
)
from app.utils.exceptions import ReportNotFoundError, StorageError
from app.utils.logging import get_logger

logger = get_logger(__name__)


class ReportService:
    """Service for managing report storage and retrieval."""
    
    def __init__(self):
        self.settings = get_settings()
        self.reports_dir = Path(self.settings.REPORTS_DIRECTORY)
        self._ensure_reports_directory()
    
    def _ensure_reports_directory(self) -> None:
        """Ensure the reports directory exists."""
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        logger.info("Reports directory ready", path=str(self.reports_dir))
    
    def _get_report_path(self, report_id: str) -> Path:
        """Get the file path for a report."""
        # Validate report_id is a valid UUID to prevent path traversal
        try:
            uuid.UUID(report_id)
        except ValueError:
            raise StorageError(
                message=f"Invalid report ID format: {report_id}",
                operation="get_path",
            )
        return self.reports_dir / f"{report_id}.json"
    
    def _get_markdown_path(self, report_id: str) -> Path:
        """Get the markdown file path for a report."""
        try:
            uuid.UUID(report_id)
        except ValueError:
            raise StorageError(
                message=f"Invalid report ID format: {report_id}",
                operation="get_path",
            )
        return self.reports_dir / f"{report_id}.md"
    
    async def save_report(self, report: PipelineResponse, request_data: Dict) -> str:
        """
        Save a report to storage.
        
        Args:
            report: The pipeline response to save
            request_data: Original request data (company_name, partner_company, domain)
            
        Returns:
            The report ID
        """
        try:
            report_id = report.report_id
            
            # Prepare report data
            report_data = {
                "report_id": report_id,
                "company_name": request_data.get("company_name", ""),
                "partner_company": request_data.get("partner_company", ""),
                "domain": request_data.get("domain", ""),
                "status": report.status,
                "content": report.content,
                "sections": {
                    "research": {
                        "status": report.sections.research.status,
                        "content": report.sections.research.content,
                        "error": report.sections.research.error,
                    },
                    "product": {
                        "status": report.sections.product.status,
                        "content": report.sections.product.content,
                        "error": report.sections.product.error,
                    },
                    "marketing": {
                        "status": report.sections.marketing.status,
                        "content": report.sections.marketing.content,
                        "error": report.sections.marketing.error,
                    },
                },
                "created_at": report.metadata.created_at.isoformat(),
                "execution_time_ms": report.metadata.execution_time_ms,
                "tokens_used": report.metadata.tokens_used,
            }
            
            # Save JSON metadata
            json_path = self._get_report_path(report_id)
            async with aiofiles.open(json_path, "w", encoding="utf-8") as f:
                await f.write(json.dumps(report_data, indent=2))
            
            # Save Markdown content
            md_path = self._get_markdown_path(report_id)
            async with aiofiles.open(md_path, "w", encoding="utf-8") as f:
                await f.write(report.content)
            
            logger.info(
                "Report saved",
                report_id=report_id,
                company_name=request_data.get("company_name"),
            )
            
            return report_id
            
        except Exception as e:
            logger.error("Failed to save report", error=str(e))
            raise StorageError(
                message=f"Failed to save report: {str(e)}",
                operation="save",
            )
    
    async def get_report(self, report_id: str) -> ReportDetail:
        """
        Retrieve a report by ID.
        
        Args:
            report_id: The report UUID
            
        Returns:
            ReportDetail with full content
            
        Raises:
            ReportNotFoundError: If report doesn't exist
        """
        json_path = self._get_report_path(report_id)
        
        if not json_path.exists():
            raise ReportNotFoundError(report_id)
        
        try:
            async with aiofiles.open(json_path, "r", encoding="utf-8") as f:
                data = json.loads(await f.read())
            
            return ReportDetail(
                report_id=data["report_id"],
                company_name=data["company_name"],
                partner_company=data["partner_company"],
                domain=data["domain"],
                status=data["status"],
                content=data["content"],
                sections=PipelineSections(
                    research=SectionStatus(**data["sections"]["research"]),
                    product=SectionStatus(**data["sections"]["product"]),
                    marketing=SectionStatus(**data["sections"]["marketing"]),
                ),
                created_at=datetime.fromisoformat(data["created_at"]),
                execution_time_ms=data["execution_time_ms"],
                tokens_used=data.get("tokens_used", 0),
            )
            
        except ReportNotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to read report", report_id=report_id, error=str(e))
            raise StorageError(
                message=f"Failed to read report: {str(e)}",
                operation="read",
            )
    
    async def get_report_markdown(self, report_id: str) -> str:
        """Get the raw markdown content of a report."""
        md_path = self._get_markdown_path(report_id)
        
        if not md_path.exists():
            raise ReportNotFoundError(report_id)
        
        async with aiofiles.open(md_path, "r", encoding="utf-8") as f:
            return await f.read()
    
    async def list_reports(
        self,
        page: int = 1,
        limit: int = 20,
        sort: str = "created_at",
        order: str = "desc",
    ) -> tuple[List[ReportSummary], int]:
        """
        List all reports with pagination.
        
        Returns:
            Tuple of (list of report summaries, total count)
        """
        try:
            reports = []
            
            # Get all JSON files
            json_files = list(self.reports_dir.glob("*.json"))
            
            for json_path in json_files:
                try:
                    async with aiofiles.open(json_path, "r", encoding="utf-8") as f:
                        data = json.loads(await f.read())
                    
                    reports.append(ReportSummary(
                        report_id=data["report_id"],
                        company_name=data["company_name"],
                        partner_company=data["partner_company"],
                        domain=data["domain"],
                        status=data["status"],
                        created_at=datetime.fromisoformat(data["created_at"]),
                        execution_time_ms=data["execution_time_ms"],
                    ))
                except Exception as e:
                    logger.warning(
                        "Failed to read report file",
                        path=str(json_path),
                        error=str(e),
                    )
            
            # Sort reports
            reverse = order == "desc"
            if sort == "created_at":
                reports.sort(key=lambda r: r.created_at, reverse=reverse)
            elif sort == "company_name":
                reports.sort(key=lambda r: r.company_name.lower(), reverse=reverse)
            
            # Paginate
            total = len(reports)
            start = (page - 1) * limit
            end = start + limit
            
            return reports[start:end], total
            
        except Exception as e:
            logger.error("Failed to list reports", error=str(e))
            raise StorageError(
                message=f"Failed to list reports: {str(e)}",
                operation="list",
            )
    
    async def delete_report(self, report_id: str) -> None:
        """
        Delete a report by ID.
        
        Raises:
            ReportNotFoundError: If report doesn't exist
        """
        json_path = self._get_report_path(report_id)
        md_path = self._get_markdown_path(report_id)
        
        if not json_path.exists():
            raise ReportNotFoundError(report_id)
        
        try:
            # Delete both files
            if json_path.exists():
                await aiofiles.os.remove(json_path)
            if md_path.exists():
                await aiofiles.os.remove(md_path)
            
            logger.info("Report deleted", report_id=report_id)
            
        except Exception as e:
            logger.error("Failed to delete report", report_id=report_id, error=str(e))
            raise StorageError(
                message=f"Failed to delete report: {str(e)}",
                operation="delete",
            )
    
    async def health_check(self) -> bool:
        """Check if storage is accessible."""
        try:
            test_file = self.reports_dir / ".health_check"
            async with aiofiles.open(test_file, "w") as f:
                await f.write("ok")
            await aiofiles.os.remove(test_file)
            return True
        except Exception:
            return False


# Singleton instance
_report_service: Optional[ReportService] = None


def get_report_service() -> ReportService:
    """Get the report service singleton."""
    global _report_service
    if _report_service is None:
        _report_service = ReportService()
    return _report_service
