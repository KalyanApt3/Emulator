export class HttpRequest {
    private _requestHeaders: any = {}
    private _responseHeaders: string;

    public url: string;
    public method: string;

    public statusText: string;
    public status: number;
    public readyState: number;
    public responseText: string;
    public timeout: number;
    public ontimeout: any;
    public onreadystatechange: any;
    
    public getAllResponseHeaders(): string {
        return this._responseHeaders;
    }

    public open(method: string, url: string, async?: boolean, user?: string, password?: string) {
        this.url = url;
        this.method = method;
    }

    public abort() {
    }

    public send(data: any) {
        var settings: any = {};
        settings.url = this.url;
        settings.type = this.method;
        settings.headers = this._requestHeaders;
        settings.data = data;
        settings.dataType = "text";
        settings.timeout = this.timeout;

        settings.error = this._onAjaxError.bind(this);

        $.ajax(settings)
            .then(this._onAjax.bind(this));
    }

    public setRequestHeader(header: string, value: string) {
        this._requestHeaders[header] = value;
    }

    private _onAjaxError(xhrObj: any, textStatus: string, errorThrown: string) {
        if (textStatus === "timeout") {
            this.ontimeout();
            return;
        }

        this.statusText = textStatus;
        this.responseText = xhrObj.responseText;
        this.status = xhrObj.status;
        this.readyState = xhrObj.readyState;
        this._responseHeaders = xhrObj.getAllResponseHeaders();
        this.onreadystatechange();
    }

    private _onAjax(data: string, textStatus: string, xhrObj: any) {
        this.statusText = textStatus;
        this.status = xhrObj.status;
        this.readyState = xhrObj.readyState;
        this.responseText = !!data ? data : "";
        this._responseHeaders = xhrObj.getAllResponseHeaders();
        this.onreadystatechange();
    }
}