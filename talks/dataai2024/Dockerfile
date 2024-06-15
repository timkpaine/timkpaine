FROM python:3.11-bookworm

WORKDIR /usr/src/app

# perspective-python doesn't have a wheel for aarch64 linux yet
RUN apt-get update && apt install -y cmake wget lsb-release software-properties-common \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN wget https://apt.llvm.org/llvm.sh
RUN chmod +x llvm.sh
RUN ls -la
RUN ./llvm.sh 18

ENV CC=clang-18
ENV CXX=clang++-18
ENV LD=ld.lld-18
ENV CMAKE_C_COMPILER=clang-18
ENV CMAKE_CXX_COMPILER=clang++-18
ENV CMAKE_LINKER=lld-18

# Install Boost 1.82.0
RUN wget -O boost_1_82_0.tar.gz https://boostorg.jfrog.io/artifactory/main/release/1.82.0/source/boost_1_82_0.tar.gz \
  && tar xzf boost_1_82_0.tar.gz \
  && cd boost_1_82_0 \
  && ./bootstrap.sh --prefix=/usr/local \
  && ./b2 -j8 cxxflags=-fPIC cflags=-fPIC -a --with-program_options --with-filesystem --with-thread --with-system install

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# INSTALL JVM
RUN apt-get update && apt-get install -y openjdk-17-jdk

CMD [ "python", "./server.py" ]