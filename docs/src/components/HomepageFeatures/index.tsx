import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
    title: string;
    description: ReactNode;
};

const FeatureList: FeatureItem[] = [
    {
        title: "Easy to Use",
        description: <>Intuitive API similar to Express</>
    },
    {
        title: "Zero runtime dependencies",
        description: <>Only relies on Node.js built-in modules.</>
    },
    {
        title: "Ultra Lightweight",
        description: <>Only 21.9 kB unpacked — minimal abstraction over native Node.js HTTP.</>
    }
];

function Feature({ title, description }: FeatureItem) {
    return (
        <div className={clsx("col col--4")}>
            <div className="text--center">
                <Heading as="h2">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
