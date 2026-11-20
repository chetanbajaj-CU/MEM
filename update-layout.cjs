const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Desktop
layout = layout.replace(
  `} else {\n      document.body.classList.remove("light-theme");\n    }\n  }, [isLightMode]);\n\n  const handleLogout = () => {\n    logout();\n    navigate("/");\n  };`,
  `} else {\n      document.body.classList.remove("light-theme");\n    }\n  }, [isLightMode]);`
);

layout = layout.replace(
  `                <button onClick={handleLogout} className="text-white/60 hover:text-white transition-colors">\n                  <LogOut className="w-4 h-4" />\n                </button>\n              </div>\n            ) : (\n              <Link to="/signin" className="text-white/60 hover:text-white transition-colors">Sign In</Link>\n            )}`,
  `              </div>\n            ) : null}`
);

// Mobile
layout = layout.replace(
  `                  </Link>\n                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full rounded-md px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white block">\n                    Sign Out\n                  </button>\n                </>\n              ) : (\n                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-md px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white block">\n                  Sign In\n                </Link>\n              )}`,
  `                  </Link>\n                </>\n              ) : null}`
);

fs.writeFileSync('src/components/Layout.tsx', layout);
