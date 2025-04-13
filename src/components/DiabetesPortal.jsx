import React, { useState } from "react";
import { FaHeartbeat, FaWeight, FaRulerVertical, FaUserAlt, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { MdBloodtype, MdFamilyRestroom } from "react-icons/md";
import { TbReportMedical } from "react-icons/tb";

const DiabetesPortal = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: "",
        gender: "",
        height: "",
        weight: "",
        familyHistory: false,
        hypertension: false,
        heartDisease: false,
        hbA1c: "",
        bloodSugar: "",
        symptoms: {
            increasedThirst: false,
            frequentUrination: false,
            unexpectedFatigue: false,
            weightLoss: false,
        },
    });

    const [riskLevel, setRiskLevel] = useState(null);
    const [errors, setErrors] = useState({});

    const validateForm = (data) => {
        const newErrors = {};
        if (!data.age) newErrors.age = "Age is required";
        if (!data.gender) newErrors.gender = "Gender is required";
        if (!data.height) newErrors.height = "Height is required";
        if (!data.weight) newErrors.weight = "Weight is required";
        if (!data.hbA1c) newErrors.hbA1c = "hbA1c is required";
        if (!data.bloodSugar) newErrors.bloodSugar = "Blood Sugar is required";
        return newErrors;
    };

    const calculateRisk = () => {
        let score = 0;
        
        // Convert string inputs to numbers for comparison
        const age = Number(formData.age,10);
        const weight = parseFloat(formData.weight);
        const height = parseFloat(formData.height);
        const hbA1c = Number(formData.hbA1c);
        const bloodSugar = Number(formData.bloodSugar);
        const bmi = weight / ((height / 100) ** 2);
        
        // Scoring logic
        if (bmi > 25) score += 2;
        if (formData.familyHistory) score += 3;
        if (formData.hypertension) score += 2;
        if (formData.heartDisease) score += 2;
        if (age > 45) {
            riskScore += 2;
          }
          if (age > 120) {
            alert("age must be under 120")
          }
        if (hbA1c < 6.5)
        {
            score +=4
        }
        else if (hbA1c > 5.6 && hbA1c < 6.5) 
        {
            score += 2
        }else
        {
            score += 4
        }
        if (bloodSugar < 140)
        {
            score += 2;
        }else if (bloodSugar >=140 && bloodSugar < 199)
        {
            score += 3;
        }else
        {
            score += 4;
        }
    
        Object.values(formData.symptoms).forEach((symptom) => {
            if (symptom) score += 1;
        });
    
        // Calculate percentage (assuming max score is 20 for 100%)
        const percentage = Math.min(Math.round((score / 20) * 100), 100);
    
        // Enhanced risk level object with all required properties
        if (score <= 5) {
            return { 
                level: "Low", 
                color: "bg-green-400",
                percentage,
                description: "Your risk of developing diabetes is relatively low based on the information provided.",
                recommendations: [
                    "Maintain a healthy diet and regular exercise",
                    "Get annual check-ups to monitor your health",
                    "Be aware of diabetes symptoms"
                ],
                keyFactors: []
            };
        } 
        if (score <= 10) {
            return { 
                level: "Moderate", 
                color: "bg-yellow-400",
                percentage,
                description: "You have some risk factors for diabetes. Consider making lifestyle changes and monitoring your health.",
                recommendations: [
                    "Consult with a healthcare provider",
                    "Improve your diet and increase physical activity",
                    "Monitor your blood sugar levels regularly"
                ],
                keyFactors: getKeyFactors(score)
            };
        }
        return { 
            level: "High", 
            color: "bg-red-500",
            percentage,
            description: "Your risk factors suggest a high probability of developing diabetes. Please consult a healthcare professional.",
            recommendations: [
                "Schedule an appointment with your doctor immediately",
                "Begin a diabetes prevention program",
                "Monitor your blood sugar levels frequently"
            ],
            keyFactors: getKeyFactors(score)
        };
    };
    
    // Helper function to identify key risk factors
    const getKeyFactors = (score) => {
        const factors = [];
        const age = Number(formData.age);
        const weight = parseFloat(formData.weight);
        const height = parseFloat(formData.height);
        const hbA1c = Number(formData.hbA1c);
        const bloodSugar = Number(formData.bloodSugar);
    
        if (age > 45) factors.push("Age over 45");
        if (weight / ((height / 100) ** 2) > 25) factors.push(`BMI over 25 (${(weight / ((height / 100) ** 2)).toFixed(1)})`);
        if (formData.familyHistory) factors.push("Family history of diabetes");
        if (formData.hypertension) factors.push("Hypertension");
        if (formData.heartDisease) factors.push("Heart disease");
        if (hbA1c > 6.5) factors.push(`Elevated hbA1c (${hbA1c}%)`);
        if (bloodSugar > 199) factors.push(`High blood sugar (${bloodSugar} mg/dL)`);
    
        // Add symptoms if any are present
        const activeSymptoms = Object.entries(formData.symptoms)
            .filter(([_, value]) => value)
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim());
        
        if (activeSymptoms.length > 0) {
            factors.push(`Symptoms: ${activeSymptoms.join(', ')}`);
        }
    
        return factors;
    };
    
    const handleSubmit = () => {
        const formErrors = validateForm(formData);
        if (Object.keys(formErrors).length === 0) {
            const risk = calculateRisk();
            setRiskLevel(risk);
            setStep(4); // Make sure this is the correct step number
            setErrors({}); // Clear any previous errors
        } else {
            setErrors(formErrors);
            // Scroll to top to show errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (name.startsWith("symptoms.")) {
                const symptomKey = name.split(".")[1];
                setFormData((prev) => ({
                    ...prev,
                    symptoms: {
                        ...prev.symptoms,
                        [symptomKey]: checked,
                    },
                }));
            } else {
                setFormData((prev) => ({ ...prev, [name]: checked }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
                      <div className="text-center space-y-10 bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-4xl overflow-hidden relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-30"></div>
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-100 rounded-full opacity-30"></div>
                        
                        <div className="relative z-10 space-y-8">
                          <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                              Diabetes Risk Assessment
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                              Take control of your health with our comprehensive diabetes screening tool.
                              <span className="block mt-2 text-sm text-blue-500">✓ Scientifically validated ✓ Confidential ✓ 5-minute assessment</span>
                            </p>
                          </div>
                  
                          <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-xl group">
                            <img
                              src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                              alt="Health Assessment"
                              className="w-full h-64 md:h-80 object-cover transition-all duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                              <div className="text-left text-white transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                <p className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Photo by National Cancer Institute</p>
                                <h3 className="text-xl md:text-2xl font-bold">Early Detection Saves Lives</h3>
                                <p className="text-sm md:text-base opacity-90 mt-1">Know your risk factors today</p>
                              </div>
                            </div>
                          </div>
                  
                          <div className="pt-4">
                            <button
                              onClick={() => setStep(2)}
                              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                              <span className="relative z-10 flex items-center justify-center">
                                Start Assessment
                                <svg className="w-5 h-5 ml-2 transition-all duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </span>
                              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                            </button>
                            <p className="text-xs text-gray-400 mt-3">100% secure and confidential</p>
                          </div>
                  
                          <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              No registration required
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Takes only 5 minutes
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Evidence-based
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
            case 2:
                return (
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                          <h2 className="text-2xl font-bold">Personal Information</h2>
                          <p className="text-blue-100 mt-1">Tell us about yourself to get started</p>
                        </div>
                  
                        <div className="p-6 md:p-8 space-y-6">
                          {/* Progress indicator */}
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                              style={{ width: '25%' }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 text-right">Step 1 of 4</p>
                  
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Age Field */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Age
                                <span className="text-red-500 ml-1">*</span>
                                <span className="ml-auto text-xs text-gray-400">1-120 years</span>
                              </label>
                              <div className="relative group">
                                <input
                                  type="number"
                                  name="age"
                                  value={formData.age}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 group-hover:border-blue-300"
                                  placeholder="e.g. 28"
                                  min="1"
                                  max="120"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">yrs</span>
                              </div>
                              {errors.age && (
                                <p className="mt-1 text-sm text-red-600 flex items-center animate-fadeIn">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.age}
                                </p>
                              )}
                            </div>
                  
                            {/* Gender Field */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Gender
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                              <div className="relative group">
                                <select
                                  name="gender"
                                  value={formData.gender}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 appearance-none group-hover:border-blue-300 bg-white"
                                >
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="non-binary">Non-binary</option>
                                  <option value="other">Other</option>
                                  <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 pointer-events-none">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                              {errors.gender && (
                                <p className="mt-1 text-sm text-red-600 flex items-center animate-fadeIn">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.gender}
                                </p>
                              )}
                            </div>
                          </div>
                  
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Height Field */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Height
                                <span className="text-red-500 ml-1">*</span>
                                <span className="ml-auto text-xs text-gray-400">50-250cm</span>
                              </label>
                              <div className="relative group">
                                <input
                                  type="number"
                                  name="height"
                                  value={formData.height}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 group-hover:border-blue-300"
                                  placeholder="e.g. 175"
                                  min="50"
                                  max="250"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">cm</span>
                              </div>
                              {errors.height && (
                                <p className="mt-1 text-sm text-red-600 flex items-center animate-fadeIn">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.height}
                                </p>
                              )}
                            </div>
                  
                            {/* Weight Field */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Weight
                                <span className="text-red-500 ml-1">*</span>
                                <span className="ml-auto text-xs text-gray-400">20-300kg</span>
                              </label>
                              <div className="relative group">
                                <input
                                  type="number"
                                  name="weight"
                                  value={formData.weight}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 group-hover:border-blue-300"
                                  placeholder="e.g. 68.5"
                                  min="20"
                                  max="300"
                                  step="0.1"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">kg</span>
                              </div>
                              {errors.weight && (
                                <p className="mt-1 text-sm text-red-600 flex items-center animate-fadeIn">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.weight}
                                </p>
                              )}
                            </div>
                          </div>
                  
                          <div className="flex justify-between pt-8">
                            <button
                              onClick={() => setStep(1)}
                              className="text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                              </svg>
                              Back
                            </button>
                            <button
                              onClick={() => setStep(3)}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                            >
                              Next Step
                              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
            case 3:
                return (
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Gradient Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                          <h2 className="text-2xl font-bold">Medical Information</h2>
                          <p className="text-blue-100 mt-1">Help us assess your diabetes risk accurately</p>
                        </div>
                  
                        <div className="p-6 md:p-8 space-y-8">
                          {/* Progress Indicator */}
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                              style={{ width: '50%' }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 text-right">Step 2 of 4</p>
                  
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Medical History Card */}
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Medical History
                              </h3>
                              <div className="space-y-4">
                                {[
                                  { name: "familyHistory", label: "Family History of Diabetes" },
                                  { name: "hypertension", label: "Hypertension (High Blood Pressure)" },
                                  { name: "heartDisease", label: "Heart Disease" }
                                ].map((item) => (
                                  <div key={item.name} className="flex items-start">
                                    <div className="flex items-center h-5">
                                      <input
                                        id={item.name}
                                        name={item.name}
                                        type="checkbox"
                                        checked={formData[item.name]}
                                        onChange={handleInputChange}
                                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-all"
                                      />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <label htmlFor={item.name} className="font-medium text-gray-700">
                                        {item.label}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                  
                            {/* Test Results Card */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Test Results
                              </h3>
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                                    hbA1c Percentage
                                    <span className="ml-auto text-xs text-gray-500">Normal: 4-5.6%</span>
                                  </label>
                                  <div className="relative group">
                                    <input
                                      type="number"
                                      name="hbA1c"
                                      value={formData.hbA1c}
                                      onChange={handleInputChange}
                                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200"
                                      placeholder="e.g. 5.4"
                                      step="0.1"
                                      min="2"
                                      max="20"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">%</span>
                                  </div>
                                </div>
                  
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                                    Blood Sugar Level
                                    <span className="ml-auto text-xs text-gray-500">Fasting (mg/dL)</span>
                                  </label>
                                  <div className="relative group">
                                    <input
                                      type="number"
                                      name="bloodSugar"
                                      value={formData.bloodSugar}
                                      onChange={handleInputChange}
                                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200"
                                      placeholder="e.g. 95"
                                      min="20"
                                      max="1000"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">mg/dL</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                  
                          {/* Symptoms Section */}
                          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Symptoms
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.keys(formData.symptoms).map((symptomKey) => {
                                const label = symptomKey.replace(/([A-Z])/g, " $1").trim();
                                return (
                                  <div key={symptomKey} className="flex items-start bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                    <div className="flex items-center h-5">
                                      <input
                                        id={`symptom-${symptomKey}`}
                                        name={`symptoms.${symptomKey}`}
                                        type="checkbox"
                                        checked={formData.symptoms[symptomKey]}
                                        onChange={handleInputChange}
                                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-all"
                                      />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <label htmlFor={`symptom-${symptomKey}`} className="font-medium text-gray-700 capitalize">
                                        {label}
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                  
                          <div className="flex justify-between pt-8">
                            <button
                              onClick={() => setStep(2)}
                              className="text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors px-6 py-3 rounded-lg hover:bg-gray-100"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                              </svg>
                              Previous
                            </button>
                            <button
                              onClick={handleSubmit}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                            >
                              Calculate Risk
                              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

            case 4:
                return (
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Gradient Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                          <h2 className="text-2xl font-bold">Your Diabetes Risk Assessment</h2>
                          <p className="text-blue-100 mt-1">Here are your personalized results</p>
                        </div>
                  
                        <div className="p-8 text-center space-y-8">
                          {/* Risk Level Indicator */}
                          <div className="relative">
                            <div className={`${riskLevel.color} text-white p-8 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105`}>
                              <p className="text-sm font-medium uppercase tracking-wider">Your Risk Level</p>
                              <p className="text-4xl font-bold mt-2">{riskLevel.level}</p>
                              <div className="mt-4">
                                <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5">
                                  <div 
                                    className="bg-white h-2.5 rounded-full" 
                                    style={{ width: `${riskLevel.percentage}%` }}
                                  ></div>
                                </div>
                                <p className="text-sm font-medium mt-2">{riskLevel.percentage}% Risk Score</p>
                              </div>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white bg-opacity-30"></div>
                            <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-white bg-opacity-30"></div>
                          </div>
                  
                          {/* Risk Explanation */}
                          <div className="bg-gray-50 p-6 rounded-xl text-left space-y-4 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              What This Means
                            </h3>
                            <p className="text-gray-600">{riskLevel.description}</p>
                            
                            <div className="pt-4 space-y-3">
                              {riskLevel.recommendations.map((rec, index) => (
                                <div key={index} className="flex items-start">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                  <p className="ml-3 text-sm text-gray-700">{rec}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                  
                          {/* Key Risk Factors */}
                          {riskLevel.keyFactors && (
                            <div className="bg-blue-50 p-6 rounded-xl text-left space-y-4 border border-blue-100">
                              <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Key Risk Factors
                              </h3>
                              <div className="space-y-2">
                                {riskLevel.keyFactors.map((factor, index) => (
                                  <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <p className="ml-3 text-sm text-gray-700">{factor}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                  
                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                            <button
                              onClick={() => {
                                setStep(1);
                                setFormData({
                                  age: "",
                                  gender: "",
                                  height: "",
                                  weight: "",
                                  familyHistory: false,
                                  hypertension: false,
                                  heartDisease: false,
                                  hbA1c: "",
                                  bloodSugar: "",
                                  symptoms: {
                                    increasedThirst: false,
                                    frequentUrination: false,
                                    unexpectedFatigue: false,
                                    weightLoss: false,
                                  },
                                });
                                setRiskLevel(null);
                              }}
                              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Start Over
                            </button>
                            
                            <button
                              onClick={() => window.print()}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                              Print Results
                            </button>
                          </div>
                  
                          {/* Disclaimer */}
                          <p className="text-xs text-gray-400 mt-8">
                            Note: This assessment is not a substitute for professional medical advice. 
                            Please consult with your healthcare provider for personalized guidance.
                          </p>
                        </div>
                      </div>
                    </div>
                  );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto bg-card shadow-lg rounded-lg overflow-hidden">
                {renderStep()}
            </div>
        </div>
    );
};

export default DiabetesPortal;
