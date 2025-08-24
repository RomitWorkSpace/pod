import { 
  Grid,
  Pencil,
  Settings,
  Sparkle,
  Type,
  Upload,
} from "lucide-react";
import SettingsPanel from "../components/sidebar/panels/settings";
import ElementsPanel from "../components/sidebar/panels/elements";
import TextPanel from "../components/sidebar/panels/text";
import DrawingPanel from "../components/sidebar/panels/draw";
import UploadPanel from "../components/sidebar/panels/upload";



export const sidebarTools = [
    {
      id: "elements",
      icon: <Grid className="w-5 h-5" />,
      label: "Elements",
      panel: ()=> <ElementsPanel />
    },
    {
      id: "text",
      icon: <Type className="w-5 h-5" />,
      label: "Text",
      panel: ()=> <TextPanel />
    },
    {
      id: "uploads",
      icon: <Upload className="w-5 h-5" />,
      label: "Uploads",
      panel: ()=> <UploadPanel />
    },
    {
      id: "draw",
      icon: <Pencil className="w-5 h-5" />,
      label: "Draw",
      panel: ()=> <DrawingPanel />
    },
    {
      id: "ai",
      icon: <Sparkle className="w-5 h-5" />,
      label: "AI",
    },
    {
      id: "settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      panel: ()=> <SettingsPanel />
    },
  ];

export const colorPresets = [
  "#FFFFFF",
  "#F8F9FA",
  "#E9ECEF",
  "#DEE2E6",
  "#212529",
  "#000000",
  "#E53935",
  "#D81B60",
  "#8E24AA",
  "#5E35B1",
  "#3949AB",
  "#1E88E5",
  "#039BE5",
  "#00ACC1",
  "#00897B",
  "#43A047",
  "#7CB342",
  "#C0CA33",
  "#FFCDD2",
  "#F8BBD0",
  "#E1BEE7",
  "#D1C4E9",
  "#C5CAE9",
  "#BBDEFB",
  "#B3E5FC",
  "#B2EBF2",
  "#B2DFDB",
  "#C8E6C9",
  "#DCEDC8",
  "#F0F4C3",
];


export const textPresets = [
  {
    name: "Heading",
    text: "Add a heading",
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Inter, sans-serid",
  },
  {
    name: "Subheading",
    text: "Add a subheading",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter, sans-serid",
  },
  {
    name: "Body Text",
    text: "Add a little bit of body text",
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "Inter, sans-serid",
  },
  {
    name: "Caption",
    text: "Add a caption",
    fontSize: 12,
    fontWeight: "normal",
    fontFamily: "Inter, sans-serid",
    fontStyle: "normal",
  },
];

export const brushSizes = [
  { value: 2, label: "Small" },
  { value: 5, label: "Medium" },
  { value: 10, label: "Large" },
  { value: 20, label: "Extra Large" },
];

export const drawingPanelColorPresets = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFD1DC",
  "#FFADAD",
  "#FFD6A5",
  "#FDFFB6",
  "#CAFFBF",
  "#FF9900",
  "#9900FF",
  "#FF00FF",
  "#00FFFF",
  "#FFFF00",
  // Muted colors
  "#6B705C",
  "#A5A58D",
  "#B7B7A4",
  "#CB997E",
  "#DDBEA9",
  // Dark colors
  "#1A1A2E",
  "#16213E",
  "#0F3460",
  "#533483",
  "#E94560",
];

export const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Impact",
  "Comic Sans MS",
];