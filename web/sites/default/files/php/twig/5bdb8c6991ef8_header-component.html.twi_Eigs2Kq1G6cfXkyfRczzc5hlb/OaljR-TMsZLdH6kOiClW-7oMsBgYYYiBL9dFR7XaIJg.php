<?php

/* @ongea_theme/components/header-component.html.twig */
class __TwigTemplate_7c06a154180ff0ff14d06d2eb8ef3b0028baf27fa141496bbf1e4e65ec126cc0 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("if" => 8);
        $filters = array("raw" => 10);
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if'),
                array('raw'),
                array()
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 1
        echo "<div style=\"margin-left: 15px; max-width: 100%;\">
    ";
        // line 3
        echo "    <header class=\"page-header\">
        <div class=\"row\">
            <div class=\"secondary-menu\">
                ";
        // line 6
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "secondary_menu", array()), "html", null, true));
        echo "

                ";
        // line 8
        if ($this->getAttribute(($context["page"] ?? null), "edit_profile", array())) {
            // line 9
            echo "                    <div class=\"profile-wrapper\">
                        ";
            // line 10
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["page"] ?? null), "edit_profile", array())));
            echo "
                    </div>
                ";
        }
        // line 13
        echo "            </div>
            <div class=\"header-content\">
                ";
        // line 15
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "header", array()), "html", null, true));
        echo "
            </div>
        </div>
    </header>

    ";
        // line 21
        echo "    <div class=\"ongea-navigation\">
        <div class=\"main-menu\">
            <div class=\"burger\">
                <i class=\"fas fa-bars -burger -icon\"></i>
                <i class=\"fas fa-times -times -icon\"></i>
            </div>
            <div class=\"-content\">
                ";
        // line 28
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "primary_menu", array()), "html", null, true));
        echo "
            </div>
        </div>
    </div>

    ";
        // line 34
        echo "    <div class=\"container notifications\">
        ";
        // line 36
        echo "        <div class=\"breadcrumb\">
            ";
        // line 37
        if ($this->getAttribute(($context["page"] ?? null), "breadcrumb", array())) {
            // line 38
            echo "                ";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "breadcrumb", array()), "html", null, true));
            echo "
            ";
        }
        // line 40
        echo "        </div>

        ";
        // line 43
        echo "        <div class=\"highlighted\">
            ";
        // line 44
        if ($this->getAttribute(($context["page"] ?? null), "highlighted", array())) {
            // line 45
            echo "                ";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "highlighted", array()), "html", null, true));
            echo "
            ";
        }
        // line 47
        echo "        </div>

        ";
        // line 50
        echo "        <div class=\"help\">
            ";
        // line 51
        if ($this->getAttribute(($context["page"] ?? null), "help", array())) {
            // line 52
            echo "                ";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "help", array()), "html", null, true));
            echo "
            ";
        }
        // line 54
        echo "        </div>
    </div>
</div>";
    }

    public function getTemplateName()
    {
        return "@ongea_theme/components/header-component.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  140 => 54,  134 => 52,  132 => 51,  129 => 50,  125 => 47,  119 => 45,  117 => 44,  114 => 43,  110 => 40,  104 => 38,  102 => 37,  99 => 36,  96 => 34,  88 => 28,  79 => 21,  71 => 15,  67 => 13,  61 => 10,  58 => 9,  56 => 8,  51 => 6,  46 => 3,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/components/header-component.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/components/header-component.html.twig");
    }
}
