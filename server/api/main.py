import logging
import os

# from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware

# from dependencies.environment import validate_local_environment

# load_dotenv()
# validate_local_environment()

root = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)


def make_app():
    from fastapi import FastAPI

    _app = FastAPI()

    origins = [
        "http://localhost",
        "http://localhost:5173",
        "https://hacktech-deploy-296479925771.europe-west4.run.app"
    ]

    from api.routes import prompt
    from api.routes import auth
    from api.routes import context
    from api.routes import file
    from api.routes import final_prompt
    from api.routes import get_file
    from api.routes import google_fit
    from api.routes import health_report
    from api.routes import medication






    _app.include_router(prompt.router)
    _app.include_router(auth.router)
    _app.include_router(file.router)
    _app.include_router(context.router)
    _app.include_router(final_prompt.router)
    _app.include_router(get_file.router)
    _app.include_router(google_fit.router)
    _app.include_router(health_report.router)
    _app.include_router(medication.router)




    _app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return _app


app = make_app()
handler = None
