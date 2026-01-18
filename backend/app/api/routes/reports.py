"""
Report Management API endpoints.
Handles report listing, retrieval, download, and deletion.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response

from app.api.middleware import verify_api_key
from app.models.requests import ReportQuery
from app.models.responses import ReportListResponse, ReportDetail
from app.services.report_service import get_report_service

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])


@router.get(
    "",
    response_model=ReportListResponse,
    summary="List All Reports",
    description="Retrieve a paginated list of all generated reports.",
    responses={
        200: {"description": "Reports retrieved successfully"},
        401: {"description": "Invalid or missing API key"},
        500: {"description": "Storage error"},
    },
)
async def list_reports(
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=20, ge=1, le=100, description="Items per page"),
    sort: str = Query(default="created_at", pattern="^(created_at|company_name)$"),
    order: str = Query(default="desc", pattern="^(asc|desc)$"),
    api_key: str = Depends(verify_api_key),
) -> ReportListResponse:
    """
    List all reports with pagination.
    
    - **page**: Page number (default: 1)
    - **limit**: Items per page (default: 20, max: 100)
    - **sort**: Sort field (created_at or company_name)
    - **order**: Sort order (asc or desc)
    """
    report_service = get_report_service()
    reports, total = await report_service.list_reports(
        page=page,
        limit=limit,
        sort=sort,
        order=order,
    )
    
    return ReportListResponse(
        reports=reports,
        total=total,
        page=page,
        limit=limit,
    )


@router.get(
    "/{report_id}",
    response_model=ReportDetail,
    summary="Get Report Details",
    description="Retrieve full details of a specific report by ID.",
    responses={
        200: {"description": "Report retrieved successfully"},
        400: {"description": "Invalid report ID format"},
        401: {"description": "Invalid or missing API key"},
        404: {"description": "Report not found"},
        500: {"description": "Storage error"},
    },
)
async def get_report(
    report_id: str,
    api_key: str = Depends(verify_api_key),
) -> ReportDetail:
    """
    Get a report by ID.
    
    - **report_id**: UUID of the report
    """
    report_service = get_report_service()
    return await report_service.get_report(report_id)


@router.get(
    "/{report_id}/download",
    summary="Download Report",
    description="Download the report as a Markdown file.",
    responses={
        200: {
            "description": "Markdown file download",
            "content": {"text/markdown": {}},
        },
        400: {"description": "Invalid report ID format"},
        401: {"description": "Invalid or missing API key"},
        404: {"description": "Report not found"},
    },
)
async def download_report(
    report_id: str,
    api_key: str = Depends(verify_api_key),
) -> Response:
    """
    Download a report as a Markdown file.
    
    - **report_id**: UUID of the report
    """
    report_service = get_report_service()
    
    # Get the report to verify it exists and get metadata
    report = await report_service.get_report(report_id)
    markdown_content = await report_service.get_report_markdown(report_id)
    
    # Create filename
    filename = f"report_{report.company_name}_{report.partner_company}_{report_id[:8]}.md"
    # Sanitize filename
    filename = "".join(c if c.isalnum() or c in "._- " else "_" for c in filename)
    
    return Response(
        content=markdown_content,
        media_type="text/markdown",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
        },
    )


@router.delete(
    "/{report_id}",
    status_code=204,
    summary="Delete Report",
    description="Delete a report by ID.",
    responses={
        204: {"description": "Report deleted successfully"},
        400: {"description": "Invalid report ID format"},
        401: {"description": "Invalid or missing API key"},
        404: {"description": "Report not found"},
        500: {"description": "Storage error"},
    },
)
async def delete_report(
    report_id: str,
    api_key: str = Depends(verify_api_key),
) -> None:
    """
    Delete a report.
    
    - **report_id**: UUID of the report
    """
    report_service = get_report_service()
    await report_service.delete_report(report_id)
