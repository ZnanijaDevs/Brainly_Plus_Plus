import ToBackground from "@lib/ToBackground";

class Core {
  private path = window.location.href;

  private jsFiles: string[] = [];
  private cssFiles: string[] = [];

  private Path(pattern: RegExp): boolean {
    return pattern.test(this.path);
  }

  constructor() {
    this.Init();
  }

  Init() {
    if (this.Path(/\/users\/user_content\/[1-9]\d*\/?/)) {
      this.AddInjectedFiles([
        "content-scripts/UserContent/index.js"
      ]);
    }

    if (this.Path(/\/$|(predmet\/\w+$)/)) {
      this.AddInjectedFiles([
        "content-scripts/HomePage/index.js",
        "styles/HomePage/index.css"
      ]);
    }

    if (this.Path(/\/task\/\d+/)) {
      this.AddInjectedFiles([
        "content-scripts/Task/index.js",
        "styles/Task/index.css"
      ]);
    }

    this.AddInjectedFiles([
      "content-scripts/Shared/ModerationPanel/index.js",
      "styles/ModerationPanel/index.css",
      "styles/ModerationTicket/index.css"
    ]);

    this.AddWindowLoadedListener();
  }


  AddInjectedFiles(files: string[]) {
    this.jsFiles.push(
      ...files.filter(file => file.match(/\.js$/))
    );
    this.cssFiles.push(
      ...files.filter(file => file.match(/\.css$/))
    );
  }

  AddWindowLoadedListener() {
    window.onload = () => {
      if (this.cssFiles.length) ToBackground("InjectStyles", this.cssFiles);
      ToBackground("InjectScripts", this.jsFiles);

      console.debug("[Brainly++] Injected files", { 
        css: this.cssFiles, 
        js: this.jsFiles 
      });
    };
  }
}

new Core();