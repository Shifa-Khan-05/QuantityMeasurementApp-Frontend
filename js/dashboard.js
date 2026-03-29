document.addEventListener("DOMContentLoaded", function () {
    // --- 1. SESSION & USER LOGIC ---
    const userName = localStorage.getItem("loggedInUser");
    if (!userName) {
        window.location.href = "login.html"; // Secure redirect if not logged in
    } else {
        document.getElementById("displayUserName").textContent = `Welcome, ${userName}`;
    }

    // --- 2. UNIT DATA CONFIGURATION ---
    const unitData = {
        length: {
            units: ["Metres", "Centimetres", "Inches", "Feet", "Kilometres", "Miles"],
            ratios: { Metres: 1, Centimetres: 100, Inches: 39.3701, Feet: 3.28084, Kilometres: 0.001, Miles: 0.000621 }
        },
        temperature: {
            units: ["Celsius", "Fahrenheit", "Kelvin"]
        },
        volume: {
            units: ["Litres", "Millilitres", "Gallons", "Quarts", "Cups"],
            ratios: { Litres: 1, Millilitres: 1000, Gallons: 0.264172, Quarts: 1.05669, Cups: 4.22675 }
        },
        weight: {
            units: ["Kilograms", "Grams", "Pounds", "Ounces"],
            ratios: { Kilograms: 1, Grams: 1000, Pounds: 2.20462, Ounces: 35.274 }
        }
    };

    let currentType = "length";
    const fromValue = document.getElementById("fromValue");
    const toValue = document.getElementById("toValue");
    const fromUnit = document.getElementById("fromUnit");
    const toUnit = document.getElementById("toUnit");

    // --- 3. CONVERSION ENGINE ---
    function updateDropdowns() {
        const options = unitData[currentType].units;
        fromUnit.innerHTML = options.map(u => `<option value="${u}">${u}</option>`).join("");
        toUnit.innerHTML = options.map(u => `<option value="${u}">${u}</option>`).join("");
        toUnit.selectedIndex = 1; // Default to different unit
        calculate();
    }

    function calculate() {
        const val = parseFloat(fromValue.value);
        if (isNaN(val)) { toValue.value = ""; return; }

        const unitFrom = fromUnit.value;
        const unitTo = toUnit.value;

        if (currentType === "temperature") {
            let celsius;
            if (unitFrom === "Celsius") celsius = val;
            else if (unitFrom === "Fahrenheit") celsius = (val - 32) * 5/9;
            else celsius = val - 273.15;

            let result;
            if (unitTo === "Celsius") result = celsius;
            else if (unitTo === "Fahrenheit") result = (celsius * 9/5) + 32;
            else result = celsius + 273.15;
            toValue.value = result.toFixed(2);
        } else {
            const ratios = unitData[currentType].ratios;
            const inBase = val / ratios[unitFrom];
            const result = inBase * ratios[unitTo];
            toValue.value = result % 1 === 0 ? result : result.toFixed(4);
        }
    }

    // --- 4. EVENT LISTENERS ---
    document.querySelectorAll(".type-box").forEach(box => {
        box.addEventListener("click", () => {
            document.querySelectorAll(".type-box").forEach(b => b.classList.remove("active"));
            box.classList.add("active");
            currentType = box.dataset.type;
            fromValue.value = ""; // Clear values on switch as requested
            toValue.value = "";
            updateDropdowns();
        });
    });

    [fromValue, fromUnit, toUnit].forEach(el => {
        el.addEventListener("input", calculate);
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    // Initialize
    updateDropdowns();
});