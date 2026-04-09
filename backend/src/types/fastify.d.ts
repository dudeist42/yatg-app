import { FastifyRequest as OriginalFastifyRequest } from 'fastify';
import type { CookieSerializeOptions, UnsignResult } from '@fastify/cookie';

declare module 'fastify' {
  interface FastifyRequest extends OriginalFastifyRequest {
    cookies: { [key: string]: string };
    signedCookies: { [key: string]: string };
  }

  interface FastifyReply {
    /**
     * Set response cookie
     * @name setCookie
     * @param name Cookie name
     * @param value Cookie value
     * @param options Serialize options
     */
    setCookie(
      name: string,
      value: string,
      options?: CookieSerializeOptions,
    ): this;

    /**
     * @alias setCookie
     */
    cookie(name: string, value: string, options?: CookieSerializeOptions): this;

    /**
     * clear response cookie
     * @param name Cookie name
     * @param options Serialize options
     */
    clearCookie(name: string, options?: CookieSerializeOptions): this;

    /**
     * Unsigns the specified cookie using the secret provided.
     * @param value Cookie value
     */
    unsignCookie(value: string): UnsignResult;
  }
}
