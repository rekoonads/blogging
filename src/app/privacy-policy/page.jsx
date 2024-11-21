"use client";

import React, { useState, useEffect } from "react";
import styles from "./privacyPolicy.module.css";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "changes", title: "Changes to This Privacy Policy" },
    {
      id: "collection",
      title: "How We Collect and Use Your Personal Information",
    },
    { id: "what-we-collect", title: "What Personal Information We Collect" },
    { id: "contact", title: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) =>
        document.getElementById(section.id)
      );

      const currentSection = sectionElements.find((element) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: November 15, 2024</p>

        <div className={styles.layout}>
          <nav className={styles.sidebar}>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={
                      activeSection === section.id ? styles.active : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(section.id)?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.mainContent}>
            <p>
              This Privacy Policy describes how 12twelve (the &quot;Site&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects,
              uses, and discloses your personal information when you visit, use
              our services, or make a purchase from peen.com (the
              &quot;Site&quot;) or otherwise communicate with us regarding the
              Site (collectively, the &quot;Services&quot;). For purposes of
              this Privacy Policy, &quot;you&quot; and &quot;your&quot; means
              you as the user of the Services, whether you are a customer,
              website visitor, or another individual whose information we have
              collected pursuant to this Privacy Policy.
            </p>

            <p>Please read this Privacy Policy carefully.</p>

            <section id="changes">
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time, including
                to reflect changes to our practices or for other operational,
                legal, or regulatory reasons. We will post the revised Privacy
                Policy on the Site, update the &quot;Last updated&quot; date and
                take any other steps required by applicable law.
              </p>
            </section>

            <section id="collection">
              <h2>How We Collect and Use Your Personal Information</h2>
              <p>
                To provide the Services, we collect and have collected over the
                past 12 months personal information about you from a variety of
                sources, as set out below. The information that we collect and
                uses varies depending on how you interact with us.
              </p>
              <p>
                In addition to the specific uses set out below, we may use
                information we collect about you to communicate with you,
                provide or improve or improve the Services, comply with any
                applicable legal obligations, enforce any applicable terms of
                service, and to protect or defend the Services, our rights, and
                the rights of our users or others.
              </p>
            </section>

            <section id="what-we-collect">
              <h2>What Personal Information We Collect</h2>
              <p>
                The types of personal information we obtain about you depends on
                how you interact with our Site and use our Services. When we use
                the term &quot;personal information&quot;, we are referring to
                information that identifies, relates to, describes or can be
                associated with you. The following sections describe the
                categories and specific types of personal information we
                collect.
              </p>
              <h3>Information We Collect Directly from You</h3>
              <p>
                Information that you directly submit to us through our Services
                may include:
              </p>
              <ul>
                <li>
                  Contact details including your name, address, phone number,
                  and email.
                </li>
                <li>
                  Order information including your name, billing address,
                  shipping address, payment confirmation, email address, and
                  phone number.
                </li>
                <li>
                  Account information including your username, password,
                  security questions and other information used for account
                  security purposes.
                </li>
                <li>
                  Customer support information including the information you
                  choose to include in communications with us, for example, when
                  sending a message through the Services.
                </li>
              </ul>
              <p>
                Some features of the Services may require you to directly
                provide us with certain information about yourself. You may
                elect not to provide this information, but doing so may prevent
                you from using or accessing these features.
              </p>
            </section>

            <section id="contact">
              <h2>Contact</h2>
              <p>
                Should you have any questions about our privacy practices or
                this Privacy Policy, or if you would like to exercise any of the
                rights available to you, please call or email us at
                aasthajain@my12twelve.com or contact us at Shahdara, Delhi, DL,
                110093, IN.
              </p>
              <p>
                For the purpose of applicable data protection laws and if not
                explicitly stated otherwise, we are the data controller of your
                personal information.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
