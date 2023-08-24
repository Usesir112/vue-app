import { readFileSync } from "fs";
import { load, JSON_SCHEMA } from "js-yaml";

export const readYamlToJson = function (dirFile: string): any {
  const yaml = load(readFileSync(`${__dirname}/../${dirFile}`, "utf-8"), {
    schema: JSON_SCHEMA,
  });

  return yaml;
};