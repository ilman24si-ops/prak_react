import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FiturXYZ = ({ onNavigate }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fitur XYZ</h2>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Belajar shadcn/ui <Badge>Baru</Badge></CardTitle>
            <CardDescription>Contoh penggunaan komponen shadcn/ui di React</CardDescription>
          </div>
        </div>

        <CardFooter className="mt-2">
          <div className="flex gap-2">
            <Button> Simpan </Button>
            <Button variant="outline" onClick={() => onNavigate && onNavigate('Dashboard')}>Batal</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default FiturXYZ
