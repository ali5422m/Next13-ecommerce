import Container from "@/app/components/Container";
import HomeBanner from "@/app/components/HomeBanner";


export default function Home() {
  return (
      <div className="p-8">
          <Container>
              <div>
                  <HomeBanner/>
              </div>
          </Container>
      </div>
  )
}
