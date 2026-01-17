import { useTranslations } from "next-intl";
import {
  FaEye,
  FaShieldAlt,
  FaHandshake,
  FaLightbulb,
  FaBullseye,
} from "react-icons/fa";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader, Card } from "@/components/ui";

export default function AboutPage() {
  const t = useTranslations("about");

  const values = [
    {
      icon: FaEye,
      title: t("values.transparency.title"),
      description: t("values.transparency.description"),
    },
    {
      icon: FaShieldAlt,
      title: t("values.safety.title"),
      description: t("values.safety.description"),
    },
    {
      icon: FaHandshake,
      title: t("values.reliability.title"),
      description: t("values.reliability.description"),
    },
    {
      icon: FaLightbulb,
      title: t("values.innovation.title"),
      description: t("values.innovation.description"),
    },
  ];

  return (
    <MainLayout>
      <PageHeader title={t("hero.title")} subtitle={t("hero.subtitle")} />

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="text-center p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
                <FaBullseye className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t("mission.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("mission.description")}
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/30 mx-auto mb-6">
                <FaEye className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t("vision.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("vision.description")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {t("values.title")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("team.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("team.description")}
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
