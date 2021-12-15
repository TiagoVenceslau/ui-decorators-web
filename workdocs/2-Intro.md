## User Interface Decorator extension for Web

Extends the decorator validation to the web, integrating it with an HTML5 rendering strategy, allowing for:
 - Automatic Model rendering:
   - Automatic HTML5 form generation for Model objects
   - different 'modes supported' (its up to the rendering component to react to the parameters given);
   - Automatic HTML5 validation integration (including but not limited to standard HTML validations);
   - Differentiated 'Mode' Rendering (again, up to the component);

#### How does it work?

For each @uielement decorated property of a Model object, it renders the Web Component matching the given tag, and with the given props

An interface for these Web Components if provided, as well as a reference implementation

