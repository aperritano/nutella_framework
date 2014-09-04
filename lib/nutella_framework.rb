# Nutella main script
require 'logging/nutella_logging'
require 'core/nutella_core'
require 'cli/nutella_cli'
require 'config/config'
require 'config/runlist'
require 'config/project'

module Nutella
  NUTELLA_HOME = File.dirname(__FILE__)+"/../"
  
  # Store some constants and defaults in the configuration file
  if Nutella.config.empty?
    Nutella.init
  end
  
end