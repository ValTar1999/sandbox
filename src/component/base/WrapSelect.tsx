import { useState } from "react";
import clsx from "clsx";
import Icon from "./Icon";
import Button from "./Button";

const options = ["aaa", "bbb", "ccc"];

const WrapSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select account");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className="w-full cursor-pointer flex items-center justify-between px-3 py-2 shadow-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-300 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main"
      >
        <div className={clsx("text-base", { "text-gray-400": selected === "Select account", "text-gray-900": selected !== "Select account" })}>{selected}</div>
        <Icon className="text-gray-400" icon="selector" />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white shadow-sm rounded-md border border-gray-300 z-10 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {options.map((option) => (
              <div
                key={option}
                className={clsx(
                  "px-4 py-3 cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition-colors duration-300",
                  { "bg-gray-100": option === selected }
                )}
                onClick={() => handleSelect(option)}
              >
                <div className="w-full flex flex-col gap-3">
                  <div className="flex items-start w-full gap-2">
                    <Icon className="w-6 h-6 text-gray-500" icon="library"/>
                    <div className="flex flex-col w-full">
                      <div className="flex w-full justify-between">

                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm font-semibold">
                            Secondary Bank Account
                          </div>
                          <div className="text-gray-500">
                            Bank AG ••••1010
                          </div>
                        </div>

                        <div className="flex flex-col items-end text-sm gap-0.5">
                          <div className="text-right text-gray-500">Balance</div>
                          <div className="font-medium text-gray-900">
                            $111,921.02
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                    This bank account is inactive. <a href="#" className="font-semibold hover:text-yellow-800">Click here</a> to resolve this issue.
                  </div>
                </div>

                <span>{option}</span>

                {option === selected && <Icon className="text-green-500" icon="check" />}
              </div>
            ))}
            <div className="flex justify-center py-1.5">
              <Button className="w-full" size="sm" variant="linkPrimary" icon="plus" iconDirection="left">Add new bank account</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WrapSelect;
