import { createServer } from 'http';
import HttpContext from './httpContext.js';
import * as router from './router.js';
import { handleCORSPreflight } from './cors.js';
import { handleStaticResourceRequest } from './staticResourcesServer.js';

const server = createServer(async (req, res) => {
    console.log(req.method);
    let httpContext = await HttpContext.create(req, res);
    if (!handleCORSPreflight(httpContext))
        if (!handleStaticResourceRequest(httpContext))
            if (!await router.API_EndPoint(httpContext))
                httpContext.response.notFound('this end point does not exist...');

});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
