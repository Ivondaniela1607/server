import handlebars from "handlebars";
import path from "path";
import fs from "fs";
class Handlebars {
  static compile(templateName: any, data: any) {
    const filepath = path.join(
      `./resources/templates`,
      `${templateName}.hbs`
    );
    const html = fs.readFileSync(filepath, "utf-8");
    return handlebars.compile(html)(data);
  }
}

export default Handlebars;
