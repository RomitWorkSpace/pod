import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { MoveLeft, X } from "lucide-react";
import { useTshirtStore } from "@/app/store";
import { useEffect, useState } from "react";

function VariantSidebar({ showVariants }) {
  const {
    colorDropdown,
    selectedVariantCollection,
    setSelectedVariantCollection,
  } = useTshirtStore();

  const [totalSelectedVariant, setTotalSelectedVariant] = useState(0);

  const variants = [
    {
      id: "s",
      size: "S",
      color: [
        { colodId: "gray1", name: "Gray", colorCode: "#bbbbbb" },
        { colodId: "white1", name: "White", colorCode: "#ffffff" },
        { colodId: "orange1", name: "Orange", colorCode: "#fe9a00" },
        { colodId: "violet1", name: "Violet", colorCode: "#a31255" },
      ],
    },
    {
      id: "m",
      size: "M",
      color: [
        { colodId: "gray2", name: "Gray", colorCode: "#bbbbbb" },
        { colodId: "white2", name: "White", colorCode: "#ffffff" },
        { colodId: "orange2", name: "Orange", colorCode: "#fe9a00" },
        { colodId: "violet2", name: "Violet", colorCode: "#a31255" },
      ],
    },
    {
      id: "l",
      size: "L",
      color: [
        { colodId: "gray3", name: "Gray", colorCode: "#bbbbbb" },
        { colodId: "white3", name: "White", colorCode: "#ffffff" },
        { colodId: "orange3", name: "Orange", colorCode: "#fe9a00" },
        { colodId: "violet3", name: "Violet", colorCode: "#a31255" },
      ],
    },
    {
      id: "xl",
      size: "XL",
      color: [
        { colodId: "gray4", name: "Gray", colorCode: "#bbbbbb" },
        { colodId: "white4", name: "White", colorCode: "#ffffff" },
        { colodId: "orange4", name: "Orange", colorCode: "#fe9a00" },
        { colodId: "violet4", name: "Violet", colorCode: "#a31255" },
      ],
    },
    {
      id: "2xl",
      size: "2XL",
      color: [
        { colodId: "gray5", name: "Gray", colorCode: "#bbbbbb" },
        { colodId: "white5", name: "White", colorCode: "#ffffff" },
        { colodId: "orange5", name: "Orange", colorCode: "#fe9a00" },
        { colodId: "violet5", name: "Violet", colorCode: "#a31255" },
      ],
    },
  ];


  // Update total selected count whenever selectedVariantCollection changes
  useEffect(() => {
    const total = Object.values(selectedVariantCollection).reduce(
      (acc, arr) => acc + arr.length,
      0
    );
    setTotalSelectedVariant(total);
  }, [selectedVariantCollection]);

  const handleSelectedColor = (size, colorCode, name) => {
    const key = `${colorCode}-${name}`;
    const existingSelections = selectedVariantCollection[size] || [];

    let updatedSelections;
    if (existingSelections.includes(key)) {
      updatedSelections = existingSelections.filter((item) => item !== key);
    } else {
      updatedSelections = [...existingSelections, key];
    }

    setSelectedVariantCollection({
      ...selectedVariantCollection,
      [size]: updatedSelections,
    });
  };

  return (
    <div className="fixed right-0 top-[65px] bottom-0 w-[340px] bg-white border-l border-gray-200 z-10">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <div
              className="hover:border rounded-xs"
              onClick={() => showVariants(false)}
            >
              <MoveLeft />
            </div>
            <span className="font-medium">Select Variants</span>
          </div>
          <div className="float-right text-gray-600 rounded-xs hover:border">
            <X />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4>Available size</h4>
        <p className="text-xs text-gray-600">
          Optimal listings have between 5-15 variants
        </p>
        <h4 className="text-sm text-gray-700 mt-3">
          {totalSelectedVariant} Selected
        </h4>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={colorDropdown.toLowerCase()}
        >
          {variants.map((variant) => (
            <AccordionItem key={variant.id} value={variant.id} className="border">
              <AccordionTrigger className="text-lg text-gray-700 px-4">
                {variant.size}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                {variant.color.map((color) => (
                  <div key={color.colodId} className="variant-option hover:bg-gray-100 p-3">
                    <div className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        id={color.colodId}
                        checked={
                          selectedVariantCollection[variant.size]?.includes(
                            `${color.colorCode}-${color.name}`
                          ) || false
                        }
                        disabled={
                          totalSelectedVariant === 1 && selectedVariantCollection[variant.size]?.includes(
                            `${color.colorCode}-${color.name}`)
                        }
                        onChange={() =>
                          handleSelectedColor(variant.size, color.colorCode, color.name)
                        }
                      />
                      <label
                        htmlFor={color.colodId}
                        className="flex gap-3 w-full items-center"
                      >
                        <div
                          className="h-6 w-6 rounded-full outline-1"
                          style={{ backgroundColor: color.colorCode }}
                        ></div>
                        <p>{color.name}</p>
                      </label>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default VariantSidebar;
