//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'outbound_click_body.g.dart';

/// OutboundClickBody
///
/// Properties:
/// * [placement] - Stable slug describing where the link was clicked
/// * [target] - Partner the click was directed to
/// * [lang] - UI language at click time
@BuiltValue()
abstract class OutboundClickBody implements Built<OutboundClickBody, OutboundClickBodyBuilder> {
  /// Stable slug describing where the link was clicked
  @BuiltValueField(wireName: r'placement')
  OutboundClickBodyPlacementEnum get placement;
  // enum placementEnum {  splash,  landing-header,  landing-cta,  landing-footer,  layout-footer,  profile-cta,  dashboard-tiktok,  };

  /// Partner the click was directed to
  @BuiltValueField(wireName: r'target')
  OutboundClickBodyTargetEnum get target;
  // enum targetEnum {  sg-berjangka,  tiktok,  };

  /// UI language at click time
  @BuiltValueField(wireName: r'lang')
  OutboundClickBodyLangEnum? get lang;
  // enum langEnum {  en,  id,  };

  OutboundClickBody._();

  factory OutboundClickBody([void updates(OutboundClickBodyBuilder b)]) = _$OutboundClickBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(OutboundClickBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<OutboundClickBody> get serializer => _$OutboundClickBodySerializer();
}

class _$OutboundClickBodySerializer implements PrimitiveSerializer<OutboundClickBody> {
  @override
  final Iterable<Type> types = const [OutboundClickBody, _$OutboundClickBody];

  @override
  final String wireName = r'OutboundClickBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    OutboundClickBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'placement';
    yield serializers.serialize(
      object.placement,
      specifiedType: const FullType(OutboundClickBodyPlacementEnum),
    );
    yield r'target';
    yield serializers.serialize(
      object.target,
      specifiedType: const FullType(OutboundClickBodyTargetEnum),
    );
    if (object.lang != null) {
      yield r'lang';
      yield serializers.serialize(
        object.lang,
        specifiedType: const FullType(OutboundClickBodyLangEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    OutboundClickBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required OutboundClickBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'placement':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(OutboundClickBodyPlacementEnum),
          ) as OutboundClickBodyPlacementEnum;
          result.placement = valueDes;
          break;
        case r'target':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(OutboundClickBodyTargetEnum),
          ) as OutboundClickBodyTargetEnum;
          result.target = valueDes;
          break;
        case r'lang':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(OutboundClickBodyLangEnum),
          ) as OutboundClickBodyLangEnum?;
          if (valueDes == null) continue;
          result.lang = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  OutboundClickBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = OutboundClickBodyBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class OutboundClickBodyPlacementEnum extends EnumClass {

  /// Stable slug describing where the link was clicked
  @BuiltValueEnumConst(wireName: r'splash')
  static const OutboundClickBodyPlacementEnum splash = _$outboundClickBodyPlacementEnum_splash;
  /// Stable slug describing where the link was clicked
  @BuiltValueEnumConst(wireName: r'landing-header')
  static const OutboundClickBodyPlacementEnum landingHeader = _$outboundClickBodyPlacementEnum_landingHeader;
  /// Stable slug describing where the link was clicked
  @BuiltValueEnumConst(wireName: r'landing-cta')
  static const OutboundClickBodyPlacementEnum landingCta = _$outboundClickBodyPlacementEnum_landingCta;
  /// Stable slug describing where the link was clicked
  @BuiltValueEnumConst(wireName: r'landing-footer')
  static const OutboundClickBodyPlacementEnum landingFooter = _$outboundClickBodyPlacementEnum_landingFooter;
  /// Stable slug describing where the link was clicked
  @BuiltValueEnumConst(wireName: r'layout-footer')
  static const OutboundClickBodyPlacementEnum layoutFooter = _$outboundClickBodyPlacementEnum_layoutFooter;
  /// Stable slug describing where the link was clicked
  @BuiltValueEnumConst(wireName: r'profile-cta')
  static const OutboundClickBodyPlacementEnum profileCta = _$outboundClickBodyPlacementEnum_profileCta;
  /// Stable slug describing where the link was clicked
  @BuiltValueEnumConst(wireName: r'dashboard-tiktok')
  static const OutboundClickBodyPlacementEnum dashboardTiktok = _$outboundClickBodyPlacementEnum_dashboardTiktok;

  static Serializer<OutboundClickBodyPlacementEnum> get serializer => _$outboundClickBodyPlacementEnumSerializer;

  const OutboundClickBodyPlacementEnum._(String name): super(name);

  static BuiltSet<OutboundClickBodyPlacementEnum> get values => _$outboundClickBodyPlacementEnumValues;
  static OutboundClickBodyPlacementEnum valueOf(String name) => _$outboundClickBodyPlacementEnumValueOf(name);
}

class OutboundClickBodyTargetEnum extends EnumClass {

  /// Partner the click was directed to
  @BuiltValueEnumConst(wireName: r'sg-berjangka')
  static const OutboundClickBodyTargetEnum sgBerjangka = _$outboundClickBodyTargetEnum_sgBerjangka;
  /// Partner the click was directed to
  @BuiltValueEnumConst(wireName: r'tiktok')
  static const OutboundClickBodyTargetEnum tiktok = _$outboundClickBodyTargetEnum_tiktok;

  static Serializer<OutboundClickBodyTargetEnum> get serializer => _$outboundClickBodyTargetEnumSerializer;

  const OutboundClickBodyTargetEnum._(String name): super(name);

  static BuiltSet<OutboundClickBodyTargetEnum> get values => _$outboundClickBodyTargetEnumValues;
  static OutboundClickBodyTargetEnum valueOf(String name) => _$outboundClickBodyTargetEnumValueOf(name);
}

class OutboundClickBodyLangEnum extends EnumClass {

  /// UI language at click time
  @BuiltValueEnumConst(wireName: r'en')
  static const OutboundClickBodyLangEnum en = _$outboundClickBodyLangEnum_en;
  /// UI language at click time
  @BuiltValueEnumConst(wireName: r'id')
  static const OutboundClickBodyLangEnum id = _$outboundClickBodyLangEnum_id;

  static Serializer<OutboundClickBodyLangEnum> get serializer => _$outboundClickBodyLangEnumSerializer;

  const OutboundClickBodyLangEnum._(String name): super(name);

  static BuiltSet<OutboundClickBodyLangEnum> get values => _$outboundClickBodyLangEnumValues;
  static OutboundClickBodyLangEnum valueOf(String name) => _$outboundClickBodyLangEnumValueOf(name);
}

