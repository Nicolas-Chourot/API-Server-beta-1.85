export default class Controller {
    constructor(HttpContext, repository = null) {
        this.HttpContext = HttpContext;
        this.repository = repository;
    }
    get(id) {
            if (id !== undefined) {
                if (!isNaN(id)) {
                    let data = this.repository.get(id);
                    if (data)
                        this.HttpContext.response.JSON(data);
                    else
                        this.HttpContext.response.notFound("Ressource not found.");
                } else
                    this.HttpContext.response.badRequest("The Id in the request url is rather not specified or syntactically wrong.");
            }
            else
                this.HttpContext.response.JSON(this.repository.getAll());
    }
    post(data) {
        data = this.repository.add(data);
        if (this.repository.model.state.isValid) {
            this.HttpContext.response.created(data);
        } else {
            if (this.repository.model.state.inConflict)
                this.HttpContext.response.conflict(this.repository.model.state.errors);
            else
                this.HttpContext.response.badRequest(this.repository.model.state.errors);
        }
    }
    put(data) {
        if (!isNaN(this.HttpContext.path.id)) {
            this.repository.update(this.HttpContext.path.id, data);
            if (this.repository.model.state.isValid) {
                this.HttpContext.response.ok();
            } else {
                if (this.repository.model.state.notFound) {
                    this.HttpContext.response.notFound(this.repository.model.state.errors);
                } else {
                    if (this.repository.model.state.inConflict)
                        this.HttpContext.response.conflict(this.repository.model.state.errors)
                    else
                        this.HttpContext.response.badRequest(this.repository.model.state.errors);
                }
            }
        } else
            this.HttpContext.response.badRequest("The Id of ressource is not specified in the request url.")
    }
    remove(id) {
        if (!isNaN(this.HttpContext.path.id)) {
            if (this.repository.remove(id))
                this.HttpContext.response.accepted();
            else
                this.HttpContext.response.notFound("Ressource not found.");
        } else
            this.HttpContext.response.badRequest("The Id in the request url is rather not specified or syntactically wrong.");
    }
}
