'use client'

import { useState, useCallback } from 'react'
import { apiService, PipelineRequest, PipelineResponse } from '@/lib/api'

export interface UsePipelineState {
    isLoading: boolean
    isSuccess: boolean
    isError: boolean
    error: string | null
    data: PipelineResponse | null
}

export interface UsePipelineReturn extends UsePipelineState {
    runPipeline: (request: PipelineRequest) => Promise<PipelineResponse | null>
    reset: () => void
}

export function usePipeline(): UsePipelineReturn {
    const [state, setState] = useState<UsePipelineState>({
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
    })

    const runPipeline = useCallback(async (request: PipelineRequest): Promise<PipelineResponse | null> => {
        setState({
            isLoading: true,
            isSuccess: false,
            isError: false,
            error: null,
            data: null,
        })

        try {
            const response = await apiService.runPipeline(request)

            setState({
                isLoading: false,
                isSuccess: true,
                isError: false,
                error: null,
                data: response,
            })

            return response
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'An error occurred while running the pipeline'

            setState({
                isLoading: false,
                isSuccess: false,
                isError: true,
                error: errorMessage,
                data: null,
            })

            return null
        }
    }, [])

    const reset = useCallback(() => {
        setState({
            isLoading: false,
            isSuccess: false,
            isError: false,
            error: null,
            data: null,
        })
    }, [])

    return {
        ...state,
        runPipeline,
        reset,
    }
}

export default usePipeline
