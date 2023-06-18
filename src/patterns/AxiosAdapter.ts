import axios, { AxiosInstance } from 'axios';

export interface HttpAdapter {
    get<X>( url: string ): Promise<X>;
    post<X>( url: string, body: any ): Promise<X>;
    patch<X>( id: number, url: string, body: any ): Promise<X>;
    delete( id: number, url: string ): Promise<number>;
}

export class AxiosAdapter implements HttpAdapter {
    private axios: AxiosInstance = axios;

    async get<X>(url: string): Promise<X> {
        try {
            const { data } = await this.axios.get<X>( url );
            return data;
        } catch (error) {
            throw new Error('This is an error - Check logs');
        }
    }

    async post<X>( url: string, body: any ): Promise<X> {
        const { data } = await this.axios.post( url, body );
        return data;
    }

    async patch<X>( id: number, url: string, body: any ): Promise<X> {
        try {
            const { data } = await this.axios.patch( `${ url }/${ id }`, body );
            return data;
        } catch (error) {
            throw new Error('This is an error - Check logs');
        }
    }

    async delete( id: number, url: string ): Promise<number> {
        try {
            await this.axios.delete( `${ url }/${ id }` );
            return id;
        } catch (error) {
            throw new Error('This is an error - Check logs');
        }
    }
}