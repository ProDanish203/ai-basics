import { askWeather, logToConsole } from "@/lib/actions/ai";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const ToolCalling = () => {
  const handleLogToConsole = async () => {
    const result = await logToConsole("Hello, world!");
    console.log("Log to console result:", result);
  };

  const handleAskWeather = async () => {
    const result = await askWeather("What is the weather in Karachi?");
    toast.info(result);
  };

  return (
    <div className="flex gap-4">
      <Button onClick={handleLogToConsole} className="cursor-pointer">
        Log To Console Tool
      </Button>

      <Button onClick={handleAskWeather} className="cursor-pointer">
        Ask Weather Tool
      </Button>
    </div>
  );
};
