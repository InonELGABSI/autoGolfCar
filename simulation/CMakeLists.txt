cmake_minimum_required(VERSION 3.10)

# Set the project name
project(CarLocationService)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Find OpenSSL
set(OPENSSL_ROOT_DIR $ENV{OPENSSL_ROOT_DIR})
set(OPENSSL_LIBRARIES $ENV{OPENSSL_LIBRARIES})
find_package(OpenSSL REQUIRED)

# Include directories
include_directories(${PROJECT_SOURCE_DIR}/cpprestsdk/Release/include)
include_directories(${PROJECT_SOURCE_DIR}/cpprestsdk/Release/src/pch)
include_directories(${OPENSSL_INCLUDE_DIR})

# Add the cpprestsdk subdirectory
add_subdirectory(cpprestsdk/Release)

# Add the executable
add_executable(CarLocationService data_processing.cpp)

# Link libraries
target_link_libraries(CarLocationService cpprest OpenSSL::SSL OpenSSL::Crypto)
