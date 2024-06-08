import Image from "next/image";
import React from "react";

const PropertyHeaderImage: React.FC<{ image: string }> = ({ image }) => {
  return (
    // <!-- Property Header Image -->
    <section>
      <div className="container-xl m-auto">
        <div className="grid grid-cols-1">
          <Image
            src={image}
            alt=""
            className="object-cover h-[400px]"
            width={1800}
            height={400}
            priority={true}
          />
        </div>
      </div>
    </section>
  );
};

export default PropertyHeaderImage;
