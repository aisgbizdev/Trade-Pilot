//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'push_prefs_update.g.dart';

/// PushPrefsUpdate
///
/// Properties:
/// * [pushExpiry] 
/// * [pushBroadcast] 
/// * [pushDailySummary] 
/// * [pushMarketNews] 
/// * [pushCalendarEvents] 
/// * [pushPriceAnomaly] 
/// * [pushWeeklyRecap] 
/// * [pushSignalFlip] 
/// * [marketOpenSessions] 
/// * [pushDormancyNudge] 
/// * [pushOnboarding] 
/// * [dismissDisengageNotice] - Pass true to clear the one-time auto-pause banner.
/// * [guardrailRevenge] 
/// * [guardrailOvertrading] 
/// * [guardrailHighRisk] 
/// * [coolingOffEnabled] 
@BuiltValue()
abstract class PushPrefsUpdate implements Built<PushPrefsUpdate, PushPrefsUpdateBuilder> {
  @BuiltValueField(wireName: r'pushExpiry')
  bool? get pushExpiry;

  @BuiltValueField(wireName: r'pushBroadcast')
  bool? get pushBroadcast;

  @BuiltValueField(wireName: r'pushDailySummary')
  bool? get pushDailySummary;

  @BuiltValueField(wireName: r'pushMarketNews')
  bool? get pushMarketNews;

  @BuiltValueField(wireName: r'pushCalendarEvents')
  bool? get pushCalendarEvents;

  @BuiltValueField(wireName: r'pushPriceAnomaly')
  bool? get pushPriceAnomaly;

  @BuiltValueField(wireName: r'pushWeeklyRecap')
  bool? get pushWeeklyRecap;

  @BuiltValueField(wireName: r'pushSignalFlip')
  bool? get pushSignalFlip;

  @BuiltValueField(wireName: r'marketOpenSessions')
  BuiltList<PushPrefsUpdateMarketOpenSessionsEnum>? get marketOpenSessions;
  // enum marketOpenSessionsEnum {  tokyo,  london,  newyork,  };

  @BuiltValueField(wireName: r'pushDormancyNudge')
  bool? get pushDormancyNudge;

  @BuiltValueField(wireName: r'pushOnboarding')
  bool? get pushOnboarding;

  /// Pass true to clear the one-time auto-pause banner.
  @BuiltValueField(wireName: r'dismissDisengageNotice')
  bool? get dismissDisengageNotice;

  @BuiltValueField(wireName: r'guardrailRevenge')
  bool? get guardrailRevenge;

  @BuiltValueField(wireName: r'guardrailOvertrading')
  bool? get guardrailOvertrading;

  @BuiltValueField(wireName: r'guardrailHighRisk')
  bool? get guardrailHighRisk;

  @BuiltValueField(wireName: r'coolingOffEnabled')
  bool? get coolingOffEnabled;

  PushPrefsUpdate._();

  factory PushPrefsUpdate([void updates(PushPrefsUpdateBuilder b)]) = _$PushPrefsUpdate;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PushPrefsUpdateBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PushPrefsUpdate> get serializer => _$PushPrefsUpdateSerializer();
}

class _$PushPrefsUpdateSerializer implements PrimitiveSerializer<PushPrefsUpdate> {
  @override
  final Iterable<Type> types = const [PushPrefsUpdate, _$PushPrefsUpdate];

  @override
  final String wireName = r'PushPrefsUpdate';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PushPrefsUpdate object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.pushExpiry != null) {
      yield r'pushExpiry';
      yield serializers.serialize(
        object.pushExpiry,
        specifiedType: const FullType(bool),
      );
    }
    if (object.pushBroadcast != null) {
      yield r'pushBroadcast';
      yield serializers.serialize(
        object.pushBroadcast,
        specifiedType: const FullType(bool),
      );
    }
    if (object.pushDailySummary != null) {
      yield r'pushDailySummary';
      yield serializers.serialize(
        object.pushDailySummary,
        specifiedType: const FullType(bool),
      );
    }
    if (object.pushMarketNews != null) {
      yield r'pushMarketNews';
      yield serializers.serialize(
        object.pushMarketNews,
        specifiedType: const FullType(bool),
      );
    }
    if (object.pushCalendarEvents != null) {
      yield r'pushCalendarEvents';
      yield serializers.serialize(
        object.pushCalendarEvents,
        specifiedType: const FullType(bool),
      );
    }
    if (object.pushPriceAnomaly != null) {
      yield r'pushPriceAnomaly';
      yield serializers.serialize(
        object.pushPriceAnomaly,
        specifiedType: const FullType(bool),
      );
    }
    if (object.pushWeeklyRecap != null) {
      yield r'pushWeeklyRecap';
      yield serializers.serialize(
        object.pushWeeklyRecap,
        specifiedType: const FullType(bool),
      );
    }
    if (object.pushSignalFlip != null) {
      yield r'pushSignalFlip';
      yield serializers.serialize(
        object.pushSignalFlip,
        specifiedType: const FullType(bool),
      );
    }
    if (object.marketOpenSessions != null) {
      yield r'marketOpenSessions';
      yield serializers.serialize(
        object.marketOpenSessions,
        specifiedType: const FullType(BuiltList, [FullType(PushPrefsUpdateMarketOpenSessionsEnum)]),
      );
    }
    if (object.pushDormancyNudge != null) {
      yield r'pushDormancyNudge';
      yield serializers.serialize(
        object.pushDormancyNudge,
        specifiedType: const FullType(bool),
      );
    }
    if (object.pushOnboarding != null) {
      yield r'pushOnboarding';
      yield serializers.serialize(
        object.pushOnboarding,
        specifiedType: const FullType(bool),
      );
    }
    if (object.dismissDisengageNotice != null) {
      yield r'dismissDisengageNotice';
      yield serializers.serialize(
        object.dismissDisengageNotice,
        specifiedType: const FullType(bool),
      );
    }
    if (object.guardrailRevenge != null) {
      yield r'guardrailRevenge';
      yield serializers.serialize(
        object.guardrailRevenge,
        specifiedType: const FullType(bool),
      );
    }
    if (object.guardrailOvertrading != null) {
      yield r'guardrailOvertrading';
      yield serializers.serialize(
        object.guardrailOvertrading,
        specifiedType: const FullType(bool),
      );
    }
    if (object.guardrailHighRisk != null) {
      yield r'guardrailHighRisk';
      yield serializers.serialize(
        object.guardrailHighRisk,
        specifiedType: const FullType(bool),
      );
    }
    if (object.coolingOffEnabled != null) {
      yield r'coolingOffEnabled';
      yield serializers.serialize(
        object.coolingOffEnabled,
        specifiedType: const FullType(bool),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    PushPrefsUpdate object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PushPrefsUpdateBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'pushExpiry':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushExpiry = valueDes;
          break;
        case r'pushBroadcast':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushBroadcast = valueDes;
          break;
        case r'pushDailySummary':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushDailySummary = valueDes;
          break;
        case r'pushMarketNews':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushMarketNews = valueDes;
          break;
        case r'pushCalendarEvents':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushCalendarEvents = valueDes;
          break;
        case r'pushPriceAnomaly':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushPriceAnomaly = valueDes;
          break;
        case r'pushWeeklyRecap':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushWeeklyRecap = valueDes;
          break;
        case r'pushSignalFlip':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushSignalFlip = valueDes;
          break;
        case r'marketOpenSessions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(PushPrefsUpdateMarketOpenSessionsEnum)]),
          ) as BuiltList<PushPrefsUpdateMarketOpenSessionsEnum>?;
          if (valueDes == null) continue;
          result.marketOpenSessions.replace(valueDes);
          break;
        case r'pushDormancyNudge':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushDormancyNudge = valueDes;
          break;
        case r'pushOnboarding':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.pushOnboarding = valueDes;
          break;
        case r'dismissDisengageNotice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.dismissDisengageNotice = valueDes;
          break;
        case r'guardrailRevenge':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.guardrailRevenge = valueDes;
          break;
        case r'guardrailOvertrading':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.guardrailOvertrading = valueDes;
          break;
        case r'guardrailHighRisk':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.guardrailHighRisk = valueDes;
          break;
        case r'coolingOffEnabled':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.coolingOffEnabled = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PushPrefsUpdate deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PushPrefsUpdateBuilder();
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

class PushPrefsUpdateMarketOpenSessionsEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'tokyo')
  static const PushPrefsUpdateMarketOpenSessionsEnum tokyo = _$pushPrefsUpdateMarketOpenSessionsEnum_tokyo;
  @BuiltValueEnumConst(wireName: r'london')
  static const PushPrefsUpdateMarketOpenSessionsEnum london = _$pushPrefsUpdateMarketOpenSessionsEnum_london;
  @BuiltValueEnumConst(wireName: r'newyork')
  static const PushPrefsUpdateMarketOpenSessionsEnum newyork = _$pushPrefsUpdateMarketOpenSessionsEnum_newyork;

  static Serializer<PushPrefsUpdateMarketOpenSessionsEnum> get serializer => _$pushPrefsUpdateMarketOpenSessionsEnumSerializer;

  const PushPrefsUpdateMarketOpenSessionsEnum._(String name): super(name);

  static BuiltSet<PushPrefsUpdateMarketOpenSessionsEnum> get values => _$pushPrefsUpdateMarketOpenSessionsEnumValues;
  static PushPrefsUpdateMarketOpenSessionsEnum valueOf(String name) => _$pushPrefsUpdateMarketOpenSessionsEnumValueOf(name);
}

