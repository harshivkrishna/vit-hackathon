import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Trees as Tree,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  TreePine,
  Map,
  MessageSquare,
} from "lucide-react";
import { getTreeRecommendations } from "./lib/gemini";

export default function ChatInterface() {
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    windSpeed: "",
    precipitation: "",
    airQuality: "",
    numTrees: "",
    area: "",
  });
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "bot",
      content:
        "\ud83d\udc4b Hello! I'm your tree planting advisor. You can either:\n1. Fill in the environmental conditions for personalized recommendations, or\n2. Ask me general questions about tree planting and environmental impact.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => !field)) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content:
            "Please fill in all environmental conditions to get personalized recommendations.",
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "user",
          content:
            `I would like recommendations for the following conditions:\n` +
            `Temperature: ${formData.temperature}\u00b0C\n` +
            `Humidity: ${formData.humidity}%\n` +
            `Wind Speed: ${formData.windSpeed} m/s\n` +
            `Precipitation: ${formData.precipitation} mm\n` +
            `Air Quality Index: ${formData.airQuality}\n` +
            `Number of Trees: ${formData.numTrees}\n` +
            `Area: ${formData.area} hectares`,
        },
      ]);

      const recommendations = await getTreeRecommendations(formData);

      recommendations.forEach((rec, index) => {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now()-index,
              type: "bot",
              content: rec.replace(/\*/g, ""),
            },
          ]);
        }, index * 500);
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content:
            "I apologize, but I encountered an error while generating recommendations. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: userMessage,
      },
    ]);

    setLoading(true);
    try {
      const responses = await getTreeRecommendations({
        ...formData,
        userMessage,
      });

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "bot",
            content: responses.map((res) => res.replace(/\*/g, "")).join("\n"),
          },
        ]);
      }, 500);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content: "I apologize, but I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Tree className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">Tree Planting Advisor</h1>
        </div>

        <div className="mb-6 h-96 overflow-y-auto bg-gray-50 rounded-lg p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white shadow-md"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "temperature", label: "Temperature (\u00b0C)", icon: <Thermometer /> },
              { name: "humidity", label: "Humidity (%)", icon: <Droplets /> },
              { name: "windSpeed", label: "Wind Speed (m/s)", icon: <Wind /> },
              { name: "precipitation", label: "Precipitation (mm)", icon: <Droplets /> },
              { name: "airQuality", label: "Air Quality Index", icon: <Gauge /> },
              { name: "numTrees", label: "Number of Trees", icon: <TreePine /> },
              { name: "area", label: "Area (hectares)", icon: <Map /> },
            ].map(({ name, label, icon }) => (
              <div key={name} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {icon}
                  {label}
                </label>
                <input
                  type="number"
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  placeholder={`e.g., ${name === "area" ? "2.5" : "50"}`}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Get Recommendations
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <form onSubmit={handleChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask any question about trees and planting..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <MessageSquare className="w-5 h-5" />
              {loading ? "Thinking..." : "Ask"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}