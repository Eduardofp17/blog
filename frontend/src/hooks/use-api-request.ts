import type { ApiErrorResponse, ApiSuccessResponse } from '@/types';
import { useToast } from './use-toast';
import { useTranslation } from 'react-i18next';
import apiUrl from '@/config/apiConfig';
import { useGlobalContext } from '@/contexts/GlobalContext';

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

type Header = {
  'Content-Type'?: string;
  Authorization?: string;
};

type ApiResponse = {
  success: boolean;
  data?: {};
  error?: {};
};

export const useApiRequest = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setLoading } = useGlobalContext();

  const handleToast = (
    title: string,
    description: string,
    variant: 'success' | 'destructive'
  ) => {
    toast({
      title,
      description,
      variant,
    });
  };

  async function request<T>(
    endpoint: string,
    method: Methods,
    header?: Header,
    body?: object | FormData,
    successMessageCode?: string
  ): Promise<ApiSuccessResponse<T> | ApiErrorResponse> {
    try {
      let requestBody: BodyInit | undefined;
      let requestHeaders = { ...header };

      if (body instanceof FormData) {
        requestBody = body;
        delete requestHeaders['Content-Type'];
      } else if (body) {
        requestBody = JSON.stringify(body);
        requestHeaders['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: requestBody,
      });

      if (response.status === 204) {
        if (successMessageCode) {
          handleToast(t('success'), t(successMessageCode), 'success');
        }
        return { success: true, data: {} as T };
      }

      const text = await response.text();
      const jsonResponse = text ? JSON.parse(text) : null;

      if (!response.ok) {
        const errorResponse = jsonResponse as ApiErrorResponse;
        handleToast(
          t('error'),
          errorResponse.error.message || 'Internal Server Error',
          'destructive'
        );
        return { success: false, error: errorResponse.error };
      }

      const apiResponse = jsonResponse as ApiResponse;
      if (!apiResponse.success) {
        const error = apiResponse as ApiErrorResponse;
        handleToast(
          t('error'),
          error.error.message || 'Internal Server Error',
          'destructive'
        );
        return { success: false, error: error.error };
      }

      if (successMessageCode) {
        handleToast(t('success'), t(successMessageCode), 'success');
      }

      return apiResponse as ApiSuccessResponse<T>;
    } catch (error) {
      console.log('error:', error);
      handleToast(t('error'), 'Internal Server Error', 'destructive');
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
          timestamp: new Date().toISOString(),
        },
      };
    } finally {
      setLoading(false);
    }
  }

  return { request };
};
