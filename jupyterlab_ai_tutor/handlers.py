import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /jupyterlab-ai-tutor/get-example endpoint!"
        }))

class CellResponseHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        try:
            # Parse the JSON body of the request
            data = json.loads(self.request.body)
            user_input = data.get("userInput")
            current_cell_json = data.get("currentCellJSON")

            # Process the data (replace this with actual logic)
            response_data = {
                "success": True,
                "response": f"Processed input: {user_input}"
            }
        except Exception as e:
            self.set_status(400)
            response_data = {
                "success": False,
                "error": str(e)
            }

        self.finish(json.dumps(response_data))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "jupyterlab-ai-tutor", "get-example")
    handlers = [(route_pattern, CellResponseHandler)]
    web_app.add_handlers(host_pattern, handlers)


