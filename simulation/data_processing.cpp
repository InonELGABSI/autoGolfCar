#include <iostream>
#include <curl/curl.h>
#include <chrono>
#include <thread>

// Replace with your backend URL and data format (JSON example)
const std::string backend_url = "http://localhost:3000/";
const std::string data_format = "{\"timestamp\": %lld, \"locations\": [%s]}";

// Function to simulate fetching car locations (replace with your actual logic)
std::vector<double> get_car_locations() {
  // Simulate data generation
  std::vector<double> locations = {10.0, 20.0, 30.0};
  return locations;
}

// Function to send data to the backend using libcurl
void send_data_to_backend(const std::vector<double>& locations) {
  CURL *curl;
  CURLcode res;
  long http_code = 0;

  curl = curl_easy_init();
  if (curl) {
    // Convert locations to JSON string
    std::string json_data;
    long long timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
    char buffer[1024];
    snprintf(buffer, sizeof(buffer), data_format.c_str(), timestamp, "[10.0, 20.0, 30.0]"); // Replace with actual location conversion
    json_data = buffer;

    curl_easy_setopt(curl, CURLOPT_URL, backend_url.c_str());
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());
    curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, json_data.length());
    curl_easy_setopt(curl, CURLOPT_VERBOSE, 0L); // Set to 1 for detailed output

    res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
      fprintf(stderr, "curl_easy_perform failed: %s\n", curl_easy_strerror(res));
    } else {
      curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
      if (http_code != 200) {
        std::cerr << "Error: Backend returned status code " << http_code << std::endl;
      } else {
        std::cout << "Data sent successfully!" << std::endl;
      }
    }

    curl_easy_cleanup(curl);
  }
}

int main() {
  while (true) {
    // Get car locations from sensors
    std::vector<double> locations = get_car_locations();

    // Send data to backend
    send_data_to_backend(locations);

    // Wait 30 minutes before next transmission
    std::this_thread::sleep_for(std::chrono::minutes(30));
  }

  return 0;
}
