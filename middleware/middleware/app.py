import os

from middleware import app
from pyasn1 import debug

if __name__ == "__main__":
    app.run(
        threaded=False,
        host="0.0.0.0",
        processes=int(os.environ["N_PROCS"]),
        port=int(os.environ["INTER_PORT"]),
        debug=True,
    )
