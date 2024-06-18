type TestComponent = {
  title: string
}

export default function TestComponent({title} : TestComponent) {
  return <h1>{title}</h1>;
}