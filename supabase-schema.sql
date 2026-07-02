-- ============================================
-- TIENDA VIRTUAL - Schema Supabase
-- ============================================

-- Tabla de Categorías
CREATE TABLE categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL,
  imagen_url TEXT,
  categoria TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, slug) VALUES
  ('Electrónica', 'electronica'),
  ('Ropa', 'ropa'),
  ('Hogar', 'hogar'),
  ('Deportes', 'deportes'),
  ('Otros', 'otros');

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (cualquiera puede ver productos activos)
CREATE POLICY "Productos visibles públicamente" ON productos
  FOR SELECT USING (activo = true);

-- Política para categorías (cualquiera puede leer)
CREATE POLICY "Categorías visibles públicamente" ON categorias
  FOR SELECT USING (true);

-- Política para admin (solo usuarios autenticados pueden modificar)
CREATE POLICY "Admin puede gestionar productos" ON productos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar categorías" ON categorias
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Tabla de Órdenes
-- ============================================

CREATE TABLE ordenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  metodo_pago TEXT NOT NULL DEFAULT 'contra_entrega',
  estado TEXT NOT NULL DEFAULT 'pendiente',
  direccion JSONB NOT NULL,
  notas TEXT,
  telefono TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para órdenes
CREATE INDEX idx_ordenes_user_id ON ordenes(user_id);
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_ordenes_created_at ON ordenes(created_at);

-- Habilitar RLS para órdenes
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

-- Políticas para órdenes
-- Usuarios autenticados pueden ver sus propias órdenes
CREATE POLICY "Usuarios ven sus órdenes" ON ordenes
  FOR SELECT USING (auth.uid() = user_id);

-- Usuarios autenticados pueden crear órdenes
CREATE POLICY "Usuarios pueden crear órdenes" ON ordenes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir creación de órdenes sin autenticación (guest checkout)
CREATE POLICY "Guest checkout" ON ordenes
  FOR INSERT WITH CHECK (true);

-- Admin puede ver todas las órdenes
CREATE POLICY "Admin gestiona todas las órdenes" ON ordenes
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR updated_at ÓRDENES
-- ============================================

CREATE TRIGGER update_ordenes_updated_at
  BEFORE UPDATE ON ordenes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS DE EJEMPLO (opcional)
-- ============================================

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria, stock) VALUES
  ('Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido', 299.00, 'https://via.placeholder.com/400', 'electronica', 50),
  ('Camiseta Básica', 'Camiseta de algodón 100% comoda', 89.00, 'https://via.placeholder.com/400', 'ropa', 100),
  ('Lámpara LED', 'Lámpara de escritorio con 3 niveles de brillo', 159.00, 'https://via.placeholder.com/400', 'hogar', 30),
  ('Balón de Fútbol', 'Balón oficial tamaño 5', 199.00, 'https://via.placeholder.com/400', 'deportes', 25);
