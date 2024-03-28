'use client';
import useSWR from "swr";
import Select from "react-select";

const fetchModels =() => fetch("/api/getEngines").then((res) => res.json());

function ModelSelection() {
  const { data: models, isLoading } = useSWR("models", fetchModels);
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo",
  });

  const filteredModels = models?.modelOptions?.filter((model: { value: string; label: string }) => {
    const name = model.value.toLowerCase();
    return (
      name.includes("ft-personal") ||
      name === "gpt-3.5-turbo" ||
      name === "gpt-4"
    );
  });

  return (
    <div className="mt-2">
      <Select
        className="mt-2"
        options={filteredModels}
        defaultValue={model}
        placeholder={model}
        isSearchable
        isLoading={isLoading}
        menuPosition="fixed"
        classNames={{
          control: (state) => "bg-[#434654] border-[#434654]",
        }}
        onChange={(e) => setModel(e.value)}
      />
    </div>
  );
}

export default ModelSelection;