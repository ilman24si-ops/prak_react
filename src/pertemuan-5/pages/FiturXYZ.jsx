import React from 'react'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FiturXYZ = ({ onNavigate }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fitur XYZ</h2>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Belajar shadcn/ui <Badge>Baru</Badge></h3>
            <p className="text-sm text-slate-600 mt-2">Contoh penggunaan komponen shadcn/ui di React</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button> Simpan </Button>
          <Button variant="outline" onClick={() => onNavigate && onNavigate('Dashboard')}>Batal</Button>
        </div>
      </Card>
    </div>
  )
}

export default FiturXYZ
