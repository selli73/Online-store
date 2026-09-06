import axios from 'axios';

/**
 * Безопасно достаёт текст ошибки из чего угодно.
 *
 * Nest отдаёт `message` строкой, а при провале ValidationPipe — массивом строк.
 * При сетевой ошибке `error.response` вообще отсутствует, поэтому обращаться
 * к `error.response.data.message` напрямую нельзя: это роняет catch-блок.
 */
export function getErrorMessage(error: unknown, fallback = 'Что-то пошло не так'): string {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return 'Сервер недоступен. Проверьте подключение.';
        }

        const message = (error.response.data as { message?: unknown } | undefined)?.message;

        if (Array.isArray(message)) {
            return message.filter((item) => typeof item === 'string').join('. ') || fallback;
        }

        if (typeof message === 'string' && message.length > 0) {
            return message;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}
