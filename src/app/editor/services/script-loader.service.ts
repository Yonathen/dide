import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'jquery', src: 'http://d17vzy032wxsyj.cloudfront.net/jquery-slim.min.js' },
  { name: 'popper', src: 'http://d17vzy032wxsyj.cloudfront.net/popper.min.js' },
  { name: 'bootstrap', src: 'http://d17vzy032wxsyj.cloudfront.net/bootstrap.min.js' }
];

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private scripts: any = {};

  constructor() {
      ScriptStore.forEach((script: any) => {
          this.scripts[script.name] = {
              loaded: false,
              src: script.src
          };
      });
  }

  load(...scripts: string[]) {
      const promises: any[] = [];
      scripts.forEach((script) => promises.push(this.loadScript(script)));
      return Promise.all(promises);
  }

  loadScript(name: string) {
      return new Promise((resolve, reject) => {
          if (!this.scripts[name].loaded) {
              // load script
              const script = document.createElement('script') as HTMLScriptElement;
              script.type = 'text/javascript';
              script.src = this.scripts[name].src;
              script.onload = () => {
                  this.scripts[name].loaded = true;
                  resolve({ script: name, loaded: true, status: 'Loaded' });
              };
              script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
              document.getElementsByTagName('head')[0].appendChild(script);
          } else {
              resolve({ script: name, loaded: true, status: 'Already Loaded' });
          }
      });
  }
}
