document.addEventListener("alpine:init", () => {
  Alpine.data("carApp", () => {
    return {
      cars: [],
      newCar: { color: "", make: "", model: "", reg_number: "" },
      editCar: { color: "", make: "", model: "", reg_number: "" },
      mostPopularMake: "",

      showToast(message, type) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000); // Toast disappears after 3 seconds
      },

    

      async fetchCars() {
        try {
          const response = await axios.get("https://car-crud-api-by4p.onrender.com/cars");

          this.cars = response.data;
          this.calculateMostPopularMake();
        } catch (error) {
          console.error("Error fetching car data", error);
        }
      },

      calculateMostPopularMake() {
        if (this.cars.length === 0) {
          this.mostPopularMake = "No data available";
          return;
        }

        const makeCount = {};
        let maxCount = 0;
        let popularMake = "";

        this.cars.forEach(car => {
          makeCount[car.make] = (makeCount[car.make] || 0) + 1;
          if (makeCount[car.make] > maxCount) {
            maxCount = makeCount[car.make];
            popularMake = car.make;
          }
        });

        this.mostPopularMake = popularMake || "No data available";
      },

      async createCar() {
        try {
          const response = await axios.post(
            "https://car-crud-api-by4p.onrender.com/cars",
            this.newCar
          );
          this.cars.push(response.data);
          this.newCar = { color: "", make: "", model: "", reg_number: "" }; // Reset form
          this.calculateMostPopularMake();
          this.showToast("Car added successfully", "success");
        } catch (error) {
          console.error("Error creating car", error);
          this.showToast("Failed to add car", "error");
        }
      },

      async updateCar() {
        try {
          const response = await axios.put(
            `https://car-crud-api-by4p.onrender.com/cars/${this.editCar.reg_number}`,
            this.editCar
          );
          this.cars = this.cars.map((car) =>
            car.reg_number === this.editCar.reg_number ? response.data : car
          );
          this.editCar = { color: "", make: "", model: "", reg_number: "" }; // Reset form
          this.calculateMostPopularMake();
          this.showToast("Car updated successfully", "success");
        } catch (error) {
          console.error("Error updating car", error);
          this.showToast("Failed to update car", "error");
        }
      },

      async deleteCar(reg_number) {
        try {
          await axios.delete(`https://car-crud-api-by4p.onrender.com/cars/${reg_number}`);
          this.cars = this.cars.filter((car) => car.reg_number !== reg_number);
          this.calculateMostPopularMake();
          this.showToast("Car deleted successfully", "success");
        } catch (error) {
          console.error("Error deleting car", error);
          this.showToast("Failed to delete car", "error");
        }
      },

      init() {
        this.fetchCars().then(() => {
          // Extract car data from URL for editing
          const params = new URLSearchParams(window.location.search);
          const reg_number = params.get("reg_number");

          console.log("Registration number from URL:", reg_number); // Log the reg_number

          if (reg_number) {
            this.$nextTick(() => {
              const carToEdit = this.cars.find(
                (car) => car.reg_number === reg_number
              );
              console.log("Car to edit:", carToEdit); // Log the car to edit
              if (carToEdit) {
                this.editCar = { ...carToEdit }; // Load car data into editCar
              }
            });
          }
        });
      },
    };
  });
});
