#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <cpprest/http_listener.h>
#include <cpprest/json.h>

using namespace web;
using namespace web::http;
using namespace web::http::experimental::listener;

class Location {
public:
    Location(double latitude, double longitude) : latitude(latitude), longitude(longitude) {}

    double getLatitude() const { return latitude; }
    double getLongitude() const { return longitude; }

private:
    double latitude;
    double longitude;
};

void handle_post(http_request request) {
    request.extract_json().then([=](json::value requestData) {
        
        std::unordered_map<std::string, Location> carLocations;
        carLocations["Car1"] = Location(51.501, -0.05);
        carLocations["Car2"] = Location(51.502, -0.06);
        carLocations["Car3"] = Location(51.503, -0.07);

        json::value responseData;
        for (auto& car : requestData.as_array()) {
            auto carId = car.as_string();
            if (carLocations.find(carId) != carLocations.end()) {
                auto location = carLocations[carId];
                json::value locationData;
                locationData[U("latitude")] = json::value::number(location.getLatitude());
                locationData[U("longitude")] = json::value::number(location.getLongitude());
                responseData[carId] = locationData;
            }
        }

        request.reply(status_codes::OK, responseData);
    }).wait();
}

int main() {
    uri_builder uri(U("http://localhost:8080/locate"));
    auto addr = uri.to_uri().to_string();
    http_listener listener(addr);
    listener.support(methods::POST, handle_post);

    try {
        listener
            .open()
            .then([&listener]() { std::cout << "Starting to listen on: " << listener.uri().to_string() << std::endl; })
            .wait();

        std::string line;
        std::getline(std::cin, line);
    }
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    return 0;
}
