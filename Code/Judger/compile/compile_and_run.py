import _judger
import os
import subprocess
import json
from flask import Flask, request, Response
import chardet

app = Flask(__name__)
@app.route('/compile', methods=['POST'])
def compile():
    code_value = request.form.get('code')
    cin_value = request.form.get('cin')
    timestamp = request.form.get('timestamp')
    print(code_value, cin_value, timestamp)
    # f = open("1.in", "w")
    f = open(timestamp + ".in", "w")
    f.write(cin_value)
    f.close()
    # f = open("main.cpp", "w")
    f = open(timestamp + ".cpp", "w")
    f.write(code_value)
    f.close()
    # if os.system("g++ main.cpp -o main"):
    #     print("compile error")
    #     exit(1)
    # p = subprocess.Popen(args="g++ main.cpp -o main", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    p = subprocess.Popen(args="g++" + " " + timestamp + ".cpp" + " -o " + timestamp, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    out_put_logs = list()
    while p.poll() is None:
        out_put_log = str(p.stdout.readline(), encoding="utf-8")
        out_put_logs.append(out_put_log)
    # log = open("./compile.log", "w")
    log = open(timestamp + "_compile" +".log", "w")
    log.writelines(out_put_logs)
    log.close()
    print(p.returncode)
    # print(out_put_logs)
    if p.returncode != 0:
        # log = open("./compile.log", "r")
        log = open(timestamp + "_compile" + ".log", "r")
        res = log.read()
        print("Compile Error: " + res)
        return "Compile Error: " + res

    ret = _judger.run(max_cpu_time=1000,
                    max_real_time=2000,
                    max_memory=256 * 1024 * 1024,
                    max_process_number=200,
                    max_output_size=2000000,
                    # max_output_size=10000,
                    max_stack=32 * 1024 * 1024,
                    # five args above can be _judger.UNLIMITED
                    # exe_path="main",
                    exe_path=timestamp,
                    # input_path="1.in",
                    input_path=timestamp + ".in",
                    # output_path="1.out",
                    output_path=timestamp + ".out",
                    # error_path="1.out",
                    error_path=timestamp + ".out",
                    args=[],
                    # can be empty list
                    env=[],
                    # log_path="judger.log",
                    log_path=timestamp + "_judger" + ".log",
                    # can be None
                    #seccomp_rule_name="c_cpp",
                    seccomp_rule_name = None,
                    uid=0,
                    gid=0)
    print(ret)
    if ret["result"] == 0:
        # f = open("1.out", "r")
        try:
            f = open(timestamp + ".out", "r")
            return f.read()
        except UnicodeDecodeError:
            with open(timestamp + ".out", "rb") as file:
                data = file.read()
                encode_type = chardet.detect(data)
            print(encode_type)
            f = open(timestamp + ".out", "rb")
            return f.read()
    else:
        # f= open("judger.log", "r")
        # f = open(timestamp + "_judger" + ".log", "r")
        f= open(timestamp + ".out", "r")
        return "Runtime Error\n" + f.read()
