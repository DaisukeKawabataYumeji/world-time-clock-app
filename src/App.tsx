import React, { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Plus, Gear, X, CaretDown, CaretRight } from '@phosphor-icons/react'

interface TimeZoneInfo {
  id: string
  city: string
  country: string
  timeZone: string
  abbreviation: string
}

interface ClockSettings {
  showAnalog: boolean
  fontFamily: string
  countryNameSize: number
  cityNameSize: number
  timeZoneSize: number
  showDigitalSeconds: boolean
  digitalDateSize: number
  digitalTimeSize: number
  showAnalogSeconds: boolean
  analogClockSize: number
  analogClockDesign: string
  analogClockColor: string
  analogNumberSize: boolean
  analogNumberFontSize: number
}

const defaultTimeZones: TimeZoneInfo[] = [
  { id: '1', city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', abbreviation: 'JST' },
  { id: '2', city: 'New Delhi', country: 'India', timeZone: 'Asia/Kolkata', abbreviation: 'IST' },
  { id: '3', city: 'New York', country: 'United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '4', city: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '5', city: 'Yangon', country: 'Myanmar', timeZone: 'Asia/Yangon', abbreviation: 'MMT' },
  { id: '6', city: 'Beijing', country: 'China', timeZone: 'Asia/Shanghai', abbreviation: 'CST' }
]

const availableTimeZones: TimeZoneInfo[] = [
  { id: '7', city: 'Beijing', country: 'China', timeZone: 'Asia/Shanghai', abbreviation: 'CST' },
  { id: '8', city: 'Hong Kong', country: 'Hong Kong', timeZone: 'Asia/Hong_Kong', abbreviation: 'HKT' },
  { id: '9', city: 'London', country: 'United Kingdom', timeZone: 'Europe/London', abbreviation: 'GMT/BST' },
  { id: '10', city: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '11', city: 'Manila', country: 'Philippines', timeZone: 'Asia/Manila', abbreviation: 'PHT' },
  { id: '12', city: 'New Delhi', country: 'India', timeZone: 'Asia/Kolkata', abbreviation: 'IST' },
  { id: '13', city: 'New York', country: 'United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '14', city: 'Ohio', country: 'United States', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { id: '15', city: 'Paris', country: 'France', timeZone: 'Europe/Paris', abbreviation: 'CET/CEST' },
  { id: '16', city: 'Perth', country: 'Australia', timeZone: 'Australia/Perth', abbreviation: 'AWST' },
  { id: '17', city: 'Reno', country: 'United States', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { id: '18', city: 'Seoul', country: 'South Korea', timeZone: 'Asia/Seoul', abbreviation: 'KST' },
  { id: '19', city: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore', abbreviation: 'SGT' },
  { id: '20', city: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney', abbreviation: 'AEST/AEDT' },
  { id: '21', city: 'Taipei', country: 'Taiwan', timeZone: 'Asia/Taipei', abbreviation: 'CST' },
  { id: '22', city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', abbreviation: 'JST' },
  { id: '23', city: 'Toronto', country: 'Canada', timeZone: 'America/Toronto', abbreviation: 'EST/EDT' },
  { id: '24', city: 'Yangon', country: 'Myanmar', timeZone: 'Asia/Yangon', abbreviation: 'MMT' }
]

const fontFamilies = [
  'Times New Roman', 'Arial', 'Helvetica', 'Georgia', 'Verdana',
  'Courier New', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino',
  'Garamond', 'Bookman', 'Avant Garde', 'Optima', 'Futura',
  'Gill Sans', 'Century Gothic', 'Franklin Gothic', 'Lucida Console', 'Monaco'
]

const analogColors = [
  'silver', 'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange',
  'purple', 'pink', 'brown', 'gray', 'gold', 'navy', 'maroon',
  'olive', 'lime', 'aqua', 'teal', 'fuchsia'
]

const analogDesigns = [
  'Classic Elegance', 'Modern Minimalist', 'Vintage Brass', 'Ocean Blue',
  'Sunset Gold', 'Forest Green', 'Royal Purple', 'Rose Gold',
  'Midnight Black', 'Arctic White', 'Copper Glow', 'Ruby Red',
  'Sapphire Blue', 'Emerald Green', 'Amber Warmth', 'Platinum Shine',
  'Cherry Blossom', 'Deep Ocean', 'Golden Hour', 'Northern Lights'
]

function WorldClock() {
  const [activeTimeZones, setActiveTimeZones] = useKV<TimeZoneInfo[]>('world-clock-timezones', defaultTimeZones)
  const [settings, setSettings] = useKV<ClockSettings>('world-clock-settings', {
    showAnalog: true,
    fontFamily: 'Times New Roman',
    countryNameSize: 30,
    cityNameSize: 30,
    timeZoneSize: 30,
    showDigitalSeconds: true,
    digitalDateSize: 20,
    digitalTimeSize: 30,
    showAnalogSeconds: true,
    analogClockSize: 200,
    analogClockDesign: 'Classic Elegance',
    analogClockColor: 'silver',
    analogNumberSize: true,
    analogNumberFontSize: 20
  })

  const [showConfig, setShowConfig] = useState(false)
  const [showAddClock, setShowAddClock] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const [configSections, setConfigSections] = useState({
    common: true,
    digital: false,
    analog: false
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getTimeForZone = (timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      weekday: 'short'
    }).formatToParts(currentTime)
  }

  const formatTime = (parts: Intl.DateTimeFormatPart[], includeSeconds: boolean) => {
    const time = parts.reduce((acc, part) => {
      acc[part.type] = part.value
      return acc
    }, {} as any)

    const timeStr = includeSeconds 
      ? `${time.hour}:${time.minute}:${time.second}`
      : `${time.hour}:${time.minute}`
    
    const dateStr = `${time.year}-${time.month}-${time.day} ${time.weekday}`
    
    return { time: timeStr, date: dateStr }
  }

  const addTimeZone = (timezone: TimeZoneInfo) => {
    const exists = activeTimeZones.some(tz => tz.timeZone === timezone.timeZone && tz.city === timezone.city)
    if (!exists) {
      setActiveTimeZones(current => [...current, { ...timezone, id: Date.now().toString() }])
    }
    setShowAddClock(false)
    setSearchText('')
  }

  const removeTimeZone = (id: string) => {
    setActiveTimeZones(current => current.filter(tz => tz.id !== id))
  }

  const filteredTimeZones = availableTimeZones.filter(tz => 
    tz.city.toLowerCase().includes(searchText.toLowerCase()) ||
    tz.country.toLowerCase().includes(searchText.toLowerCase()) ||
    tz.abbreviation.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (index: number) => {
    setDragOverIndex(index)
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null) return
    
    setActiveTimeZones(current => {
      const newArray = [...current]
      const draggedItem = newArray[draggedIndex]
      newArray.splice(draggedIndex, 1)
      newArray.splice(dropIndex, 0, draggedItem)
      return newArray
    })
    
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const AnalogClock = ({ timezone, size }: { timezone: TimeZoneInfo; size: number }) => {
    const timeParts = getTimeForZone(timezone.timeZone)
    const time = formatTime(timeParts, true)
    
    const [hours, minutes, seconds] = time.time.split(':').map(Number)
    const hourAngle = (hours % 12) * 30 + minutes * 0.5
    const minuteAngle = minutes * 6
    const secondAngle = seconds * 6

    const getDesignStyles = (design: string) => {
      const designs: Record<string, any> = {
        'Classic Elegance': {
          background: 'radial-gradient(circle, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
          shadow: '0 8px 32px rgba(33, 37, 41, 0.3)',
          border: '4px solid #6c757d',
          decoration: 'linear-gradient(45deg, #495057, #6c757d)'
        },
        'Modern Minimalist': {
          background: 'radial-gradient(circle, #ffffff 0%, #f8f9fa 70%, #e9ecef 100%)',
          shadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '2px solid #dee2e6',
          decoration: 'linear-gradient(45deg, #adb5bd, #ced4da)'
        },
        'Vintage Brass': {
          background: 'radial-gradient(circle, #fff8e1 0%, #ffecb3 50%, #ffc107 100%)',
          shadow: '0 8px 32px rgba(255, 193, 7, 0.4)',
          border: '6px solid #ff8f00',
          decoration: 'linear-gradient(45deg, #ff6f00, #ff8f00)'
        },
        'Ocean Blue': {
          background: 'radial-gradient(circle, #e3f2fd 0%, #bbdefb 50%, #2196f3 100%)',
          shadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
          border: '4px solid #1976d2',
          decoration: 'linear-gradient(45deg, #0d47a1, #1976d2)'
        },
        'Sunset Gold': {
          background: 'radial-gradient(circle, #fff3e0 0%, #ffcc02 50%, #ff9800 100%)',
          shadow: '0 8px 32px rgba(255, 152, 0, 0.4)',
          border: '4px solid #f57c00',
          decoration: 'linear-gradient(45deg, #e65100, #f57c00)'
        },
        'Forest Green': {
          background: 'radial-gradient(circle, #e8f5e8 0%, #c8e6c9 50%, #4caf50 100%)',
          shadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
          border: '4px solid #388e3c',
          decoration: 'linear-gradient(45deg, #1b5e20, #388e3c)'
        },
        'Royal Purple': {
          background: 'radial-gradient(circle, #f3e5f5 0%, #e1bee7 50%, #9c27b0 100%)',
          shadow: '0 8px 32px rgba(156, 39, 176, 0.4)',
          border: '4px solid #7b1fa2',
          decoration: 'linear-gradient(45deg, #4a148c, #7b1fa2)'
        },
        'Rose Gold': {
          background: 'radial-gradient(circle, #fce4ec 0%, #f8bbd9 50%, #e91e63 100%)',
          shadow: '0 8px 32px rgba(233, 30, 99, 0.4)',
          border: '4px solid #c2185b',
          decoration: 'linear-gradient(45deg, #880e4f, #c2185b)'
        },
        'Midnight Black': {
          background: 'radial-gradient(circle, #424242 0%, #212121 50%, #000000 100%)',
          shadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          border: '4px solid #616161',
          decoration: 'linear-gradient(45deg, #212121, #424242)'
        },
        'Arctic White': {
          background: 'radial-gradient(circle, #ffffff 0%, #fafafa 50%, #f5f5f5 100%)',
          shadow: '0 8px 32px rgba(158, 158, 158, 0.3)',
          border: '4px solid #e0e0e0',
          decoration: 'linear-gradient(45deg, #bdbdbd, #e0e0e0)'
        },
        'Copper Glow': {
          background: 'radial-gradient(circle, #fff8e1 0%, #ffcc02 50%, #ff5722 100%)',
          shadow: '0 8px 32px rgba(255, 87, 34, 0.4)',
          border: '4px solid #d84315',
          decoration: 'linear-gradient(45deg, #bf360c, #d84315)'
        },
        'Ruby Red': {
          background: 'radial-gradient(circle, #ffebee 0%, #ffcdd2 50%, #f44336 100%)',
          shadow: '0 8px 32px rgba(244, 67, 54, 0.4)',
          border: '4px solid #d32f2f',
          decoration: 'linear-gradient(45deg, #b71c1c, #d32f2f)'
        },
        'Sapphire Blue': {
          background: 'radial-gradient(circle, #e8eaf6 0%, #c5cae9 50%, #3f51b5 100%)',
          shadow: '0 8px 32px rgba(63, 81, 181, 0.4)',
          border: '4px solid #303f9f',
          decoration: 'linear-gradient(45deg, #1a237e, #303f9f)'
        },
        'Emerald Green': {
          background: 'radial-gradient(circle, #e0f2f1 0%, #b2dfdb 50%, #009688 100%)',
          shadow: '0 8px 32px rgba(0, 150, 136, 0.4)',
          border: '4px solid #00796b',
          decoration: 'linear-gradient(45deg, #004d40, #00796b)'
        },
        'Amber Warmth': {
          background: 'radial-gradient(circle, #fff8e1 0%, #ffecb3 50%, #ffc107 100%)',
          shadow: '0 8px 32px rgba(255, 193, 7, 0.4)',
          border: '4px solid #ffa000',
          decoration: 'linear-gradient(45deg, #ff6f00, #ffa000)'
        },
        'Platinum Shine': {
          background: 'radial-gradient(circle, #fafafa 0%, #eeeeee 50%, #9e9e9e 100%)',
          shadow: '0 8px 32px rgba(158, 158, 158, 0.4)',
          border: '4px solid #757575',
          decoration: 'linear-gradient(45deg, #424242, #757575)'
        },
        'Cherry Blossom': {
          background: 'radial-gradient(circle, #fce4ec 0%, #f8bbd9 50%, #e91e63 100%)',
          shadow: '0 8px 32px rgba(233, 30, 99, 0.4)',
          border: '4px solid #c2185b',
          decoration: 'linear-gradient(45deg, #880e4f, #c2185b)'
        },
        'Deep Ocean': {
          background: 'radial-gradient(circle, #e1f5fe 0%, #b3e5fc 50%, #03a9f4 100%)',
          shadow: '0 8px 32px rgba(3, 169, 244, 0.4)',
          border: '4px solid #0288d1',
          decoration: 'linear-gradient(45deg, #01579b, #0288d1)'
        },
        'Golden Hour': {
          background: 'radial-gradient(circle, #fff8e1 0%, #ffe082 50%, #ffb300 100%)',
          shadow: '0 8px 32px rgba(255, 179, 0, 0.4)',
          border: '4px solid #ff8f00',
          decoration: 'linear-gradient(45deg, #ff6f00, #ff8f00)'
        },
        'Northern Lights': {
          background: 'radial-gradient(circle, #e8f5e8 0%, #81c784 50%, #00e676 100%)',
          shadow: '0 8px 32px rgba(0, 230, 118, 0.4)',
          border: '4px solid #00c853',
          decoration: 'linear-gradient(45deg, #00695c, #00c853)'
        }
      }
      return designs[design] || designs['Classic Elegance']
    }

    const designStyles = getDesignStyles(settings.analogClockDesign)

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <div 
          className="absolute -inset-2 rounded-full"
          style={{ background: designStyles.decoration }}
        />
        <svg 
          width={size} 
          height={size} 
          className="relative rounded-full border-4"
          style={{ 
            background: designStyles.background,
            boxShadow: designStyles.shadow,
            borderColor: settings.analogClockColor
          }}
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {settings.analogNumberSize && Array.from({ length: 12 }, (_, i) => {
            const angle = (i + 1) * 30 - 90
            const x = size/2 + (size/2 - 30) * Math.cos(angle * Math.PI / 180)
            const y = size/2 + (size/2 - 30) * Math.sin(angle * Math.PI / 180)
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={settings.analogNumberFontSize}
                fontFamily={settings.fontFamily}
                fill={settings.analogClockColor}
                fontWeight="bold"
                filter="url(#shadow)"
              >
                {i + 1}
              </text>
            )
          })}

          <line
            x1={size/2}
            y1={size/2}
            x2={size/2 + (size/4) * Math.cos((hourAngle - 90) * Math.PI / 180)}
            y2={size/2 + (size/4) * Math.sin((hourAngle - 90) * Math.PI / 180)}
            stroke={settings.analogClockColor}
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          <line
            x1={size/2}
            y1={size/2}
            x2={size/2 + (size/3) * Math.cos((minuteAngle - 90) * Math.PI / 180)}
            y2={size/2 + (size/3) * Math.sin((minuteAngle - 90) * Math.PI / 180)}
            stroke={settings.analogClockColor}
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          {settings.showAnalogSeconds && (
            <line
              x1={size/2}
              y1={size/2}
              x2={size/2 + (size/2.5) * Math.cos((secondAngle - 90) * Math.PI / 180)}
              y2={size/2 + (size/2.5) * Math.sin((secondAngle - 90) * Math.PI / 180)}
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#shadow)"
            />
          )}

          <circle
            cx={size/2}
            cy={size/2}
            r="8"
            fill={settings.analogClockColor}
            filter="url(#shadow)"
          />
        </svg>
      </div>
    )
  }

  const ClockCard = ({ timezone, index }: { timezone: TimeZoneInfo; index: number }) => {
    const timeParts = getTimeForZone(timezone.timeZone)
    const { time, date } = formatTime(timeParts, settings.showDigitalSeconds)

    const cardWidth = Math.max(
      settings.showAnalog ? settings.analogClockSize + 40 : 200,
      Math.max(
        timezone.country.length * settings.countryNameSize * 0.6,
        timezone.city.length * settings.cityNameSize * 0.6,
        time.length * settings.digitalTimeSize * 0.6
      )
    )

    return (
      <Card
        className={`p-6 bg-card text-card-foreground border-2 cursor-move transition-all duration-200 ${
          dragOverIndex === index ? 'ring-2 ring-accent' : ''
        } ${draggedIndex === index ? 'opacity-50' : ''}`}
        style={{ width: cardWidth, minHeight: settings.showAnalog ? settings.analogClockSize + 200 : 150 }}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => {
          e.preventDefault()
          handleDragOver(index)
        }}
        onDrop={() => handleDrop(index)}
      >
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            onClick={() => removeTimeZone(timezone.id)}
          >
            <X size={14} />
          </Button>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <div 
                style={{ 
                  fontSize: settings.countryNameSize,
                  fontFamily: settings.fontFamily 
                }}
                className="font-semibold"
              >
                {timezone.country}
              </div>
              <div 
                style={{ 
                  fontSize: settings.cityNameSize,
                  fontFamily: settings.fontFamily 
                }}
                className="font-medium"
              >
                {timezone.city}
              </div>
              <div 
                style={{ 
                  fontSize: settings.timeZoneSize,
                  fontFamily: settings.fontFamily 
                }}
                className="text-muted-foreground"
              >
                {timezone.abbreviation}
              </div>
            </div>

            <div className="text-center">
              <div 
                style={{ 
                  fontSize: settings.digitalDateSize,
                  fontFamily: settings.fontFamily 
                }}
                className="text-muted-foreground"
              >
                {date}
              </div>
              <div 
                style={{ 
                  fontSize: settings.digitalTimeSize,
                  fontFamily: settings.fontFamily 
                }}
                className="font-bold tabular-nums"
              >
                {time}
              </div>
            </div>

            {settings.showAnalog && (
              <AnalogClock timezone={timezone} size={settings.analogClockSize} />
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-foreground">World Clock</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowAddClock(!showAddClock)}
              className="text-3xl p-2"
            >
              ➕
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowConfig(!showConfig)}
              className="text-3xl p-2"
            >
              ⚙️
            </Button>
          </div>
        </div>

        {showAddClock && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Clock</h3>
            <div className="space-y-4">
              <Input
                placeholder="Search cities, countries, or time zones..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="max-h-40 overflow-y-auto space-y-2">
                {filteredTimeZones.map((tz) => (
                  <div
                    key={tz.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => addTimeZone(tz)}
                  >
                    <div>
                      <div className="font-medium">{tz.city}</div>
                      <div className="text-sm text-muted-foreground">
                        {tz.country} • {tz.abbreviation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => setShowAddClock(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {showConfig && (
          <Card className="p-6 mb-10">
            <h3 className="text-lg font-semibold mb-6">Configuration</h3>
            
            <div className="space-y-6">
              <div>
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-4"
                  onClick={() => setConfigSections(prev => ({ ...prev, common: !prev.common }))}
                >
                  {configSections.common ? <CaretDown size={16} /> : <CaretRight size={16} />}
                  <h4 className="font-medium">Common Settings</h4>
                </div>
                {configSections.common && (
                  <div className="ml-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-analog"
                        checked={settings.showAnalog}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, showAnalog: !!checked }))
                        }
                      />
                      <label htmlFor="show-analog">Show analog clock</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Font family</label>
                      <Select
                        value={settings.fontFamily}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, fontFamily: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontFamilies.map((font) => (
                            <SelectItem key={font} value={font}>{font}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Country name size: {settings.countryNameSize}px
                      </label>
                      <Slider
                        value={[settings.countryNameSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, countryNameSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City name size: {settings.cityNameSize}px
                      </label>
                      <Slider
                        value={[settings.cityNameSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, cityNameSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Time zone size: {settings.timeZoneSize}px
                      </label>
                      <Slider
                        value={[settings.timeZoneSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, timeZoneSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-4"
                  onClick={() => setConfigSections(prev => ({ ...prev, digital: !prev.digital }))}
                >
                  {configSections.digital ? <CaretDown size={16} /> : <CaretRight size={16} />}
                  <h4 className="font-medium">Digital Clock Settings</h4>
                </div>
                {configSections.digital && (
                  <div className="ml-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-digital-seconds"
                        checked={settings.showDigitalSeconds}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, showDigitalSeconds: !!checked }))
                        }
                      />
                      <label htmlFor="show-digital-seconds">Show seconds in digital clock</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Digital date size: {settings.digitalDateSize}px
                      </label>
                      <Slider
                        value={[settings.digitalDateSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, digitalDateSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Digital time size: {settings.digitalTimeSize}px
                      </label>
                      <Slider
                        value={[settings.digitalTimeSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, digitalTimeSize: value }))
                        }
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-4"
                  onClick={() => setConfigSections(prev => ({ ...prev, analog: !prev.analog }))}
                >
                  {configSections.analog ? <CaretDown size={16} /> : <CaretRight size={16} />}
                  <h4 className="font-medium">Analog Clock Settings</h4>
                </div>
                {configSections.analog && (
                  <div className="ml-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-analog-seconds"
                        checked={settings.showAnalogSeconds}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, showAnalogSeconds: !!checked }))
                        }
                      />
                      <label htmlFor="show-analog-seconds">Show second hand</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Clock size: {settings.analogClockSize}px
                      </label>
                      <Slider
                        value={[settings.analogClockSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, analogClockSize: value }))
                        }
                        min={50}
                        max={500}
                        step={10}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Clock design</label>
                      <Select
                        value={settings.analogClockDesign}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, analogClockDesign: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {analogDesigns.map((design) => (
                            <SelectItem key={design} value={design}>{design}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Clock color</label>
                      <Select
                        value={settings.analogClockColor}
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, analogClockColor: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {analogColors.map((color) => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-numbers"
                        checked={settings.analogNumberSize}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, analogNumberSize: !!checked }))
                        }
                      />
                      <label htmlFor="show-numbers">Show numbers on analog clock</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number size: {settings.analogNumberFontSize}px
                      </label>
                      <Slider
                        value={[settings.analogNumberFontSize]}
                        onValueChange={([value]) => 
                          setSettings(prev => ({ ...prev, analogNumberFontSize: value }))
                        }
                        min={10}
                        max={50}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-6" style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${Math.max(
            settings.showAnalog ? settings.analogClockSize + 40 : 200,
            300
          )}px, 1fr))`
        }}>
          {activeTimeZones.map((timezone, index) => (
            <ClockCard key={timezone.id} timezone={timezone} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorldClock