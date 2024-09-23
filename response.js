//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This module define the http Response class
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Author : Nicolas Chourot
// Lionel-Groulx College
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default class Response {
    constructor(res) {
        this.res = res;
    }
    status(number, errorMessage = '') {
        if (errorMessage) {
            this.res.writeHead(number, { 'content-type': 'application/json' });
            let errorContent = { "error_description": errorMessage };
            return this.end(JSON.stringify(errorContent));
        } else {
            this.res.writeHead(number, { 'content-type': 'text/plain' });
            return this.end();
        }
    }
    end(content = null) {
        if (content)
            this.res.end(content);
        else
            this.res.end();
        return true;
    }

  /////////////////////////////////////////////// 200 ///////////////////////////////////////////////////////

    ok() { return this.status(200); }       // ok status
    JSON(obj) {                         // ok status with content
        this.res.writeHead(200, { 'content-type': 'application/json' });
        if (obj) {
            let json = JSON.stringify(obj);
            return this.end(json);
        } else
            return this.end();
    }
    HTML(content) {
        this.res.writeHead(200, { 'content-type': 'text/html' });
        return this.end(content);
    }
    accepted() { return this.status(202); } // accepted status
    deleted() { return this.status(202); }  // accepted status
    created(obj) {                      // created status
        this.res.writeHead(201, { 'content-type': 'application/json' });
        return this.end(JSON.stringify(obj));
    }
    content(contentType, content) {         // let the browers cache locally the receiverd content
        this.res.writeHead(200, { 'content-type': contentType, "Cache-Control": "public, max-age=31536000" });
        return this.end(content);
    }
    noContent() { return this.status(204); }       // no content status
    updated() { return this.status(204); }         // no content status

    /////////////////////////////////////////////// 400 ///////////////////////////////////////////////////////

    badRequest(errormessage = '') { return this.status(400, errormessage); }      // bad request status
    unAuthorized(errormessage = '') { return this.status(401, errormessage); }    // unAuthorized status
    forbidden(errormessage = '') { return this.status(403, errormessage); }       // forbidden status
    notFound(errormessage = '') { return this.status(404, errormessage); }        // not found status
    notAloud(errormessage = '') { return this.status(405, errormessage); }        // Method not aloud status
    conflict(errormessage = '') { return this.status(409, errormessage); }        // Conflict status
    unsupported(errormessage = '') { return this.status(415, errormessage); }     // Unsupported Media Type status
    unprocessable(errormessage = '') { return this.status(422, errormessage); }   // Unprocessable Entity status

    // Custom status

    userNotFound(errormessage = '') { return this.status(481, errormessage); }    // custom bad request status
    wrongPassword(errormessage = '') { return this.status(482, errormessage); }   // custom bad request status

    /////////////////////////////////////////////// 500 ///////////////////////////////////////////////////////

    internalError(errormessage = '') { return this.status(500, errormessage); }   // internal error status
    notImplemented(errormessage = '') { return this.status(501, errormessage); }  // Not implemented
}