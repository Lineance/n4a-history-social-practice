#!/usr/bin/env python
"""启动 pnpm dev，运行测试命令，结束前杀掉整个进程树（防止 Windows 遗留 node 占端口）。

用法：python scripts/devtest.py python _verify_xxx.py
"""

import os
import socket
import subprocess
import sys
import time

PORT = int(os.environ.get("DEV_PORT", "5173"))
CMD = os.environ.get("DEV_CMD", "pnpm dev")


def server_ready(port: int, timeout: int = 60) -> bool:
    end = time.time() + timeout
    while time.time() < end:
        try:
            with socket.create_connection(("localhost", port), timeout=1):
                return True
        except (socket.error, ConnectionRefusedError, OSError):
            time.sleep(0.5)
    return False


proc = subprocess.Popen(CMD, shell=True)
rc = 1
try:
    if not server_ready(PORT):
        print("dev server 启动失败")
        sys.exit(1)
    print("dev server ready on", PORT)
    rc = subprocess.run(sys.argv[1:]).returncode
finally:
    # Windows：按 PID 杀整个进程树，避免 pnpm/node 子进程遗留
    if sys.platform == "win32":
        subprocess.run(
            ["taskkill", "/F", "/T", "/PID", str(proc.pid)], capture_output=True
        )
    else:
        proc.terminate()
        proc.wait(timeout=5)
    print("server tree killed")

sys.exit(rc)
