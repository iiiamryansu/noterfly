import { format } from 'date-fns'
import { NextResponse } from 'next/server'

type ErrorResponse = {
  details?: unknown
  message?: string
  status?: number
}

type SuccessResponse<T> = {
  message?: string
  payload?: T
  status?: number
}

export function genErrorResponse({ details = 'Unknown', message = 'Unknown', status = 500 }: ErrorResponse): NextResponse {
  return NextResponse.json(
    {
      details,
      message,
      success: false,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    },
    { status },
  )
}

export function genSuccessResponse<T>({
  message = 'Success',
  payload = undefined,
  status = 200,
}: SuccessResponse<T>): NextResponse {
  return NextResponse.json(
    {
      message,
      payload: payload ?? null,
      success: true,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    },
    { status },
  )
}
