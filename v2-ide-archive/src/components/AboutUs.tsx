const AboutUs = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-blush">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary mb-8">
            About Us
          </h2>

          {/* Content */}
          <div className="space-y-6 text-foreground text-lg lg:text-xl leading-relaxed">
            <p>
              Welcome to <span className="font-serif font-semibold text-primary">Instant Créatif Statio</span>.
            </p>
            <p>
              We are the sister brand of <span className="font-medium">Instant Créatif</span>, known for crafting exquisite custom packaging and boxes. We bring that same passion for design and detail to your daily life.
            </p>
            <p>
              While Instant Créatif wraps your special gifts, <span className="font-serif italic">Statio</span> helps you organize your future with premium planners, notebooks, and tags.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
