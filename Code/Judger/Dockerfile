FROM ubuntu:20.04

ENV TZ=Europe/Kiev
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    buildDeps='software-properties-common git libtool cmake build-essential python3-dev python3-pip libseccomp-dev' && \
    apt-get update && apt-get install -y python3 python3-pkg-resources gcc g++ $buildDeps && \
    pip3 install -I --no-cache-dir psutil uwsgi flask requests && \
    cd /tmp && git clone -b newnew  --depth 1 https://github.com/QingdaoU/Judger && cd Judger && \
    mkdir build && cd build && cmake .. && make && make install && cd ../bindings/Python && python3 setup.py install && \
    apt-get purge -y --auto-remove $buildDeps && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ADD . /Judger
WORKDIR /Judger
# RUN gcc -shared -fPIC -o unbuffer.so unbuffer.c
EXPOSE 5000
ENTRYPOINT /Judger/entrypoint.sh
RUN ["chmod", "+x", "/Judger/entrypoint.sh"]