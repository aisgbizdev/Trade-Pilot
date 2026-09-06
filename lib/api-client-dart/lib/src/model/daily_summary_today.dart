//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/daily_summary_analysis.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'daily_summary_today.g.dart';

/// DailySummaryToday
///
/// Properties:
/// * [digestDate] 
/// * [kind] 
/// * [instruments] 
/// * [summary] 
/// * [createdAt] 
/// * [analyses] 
@BuiltValue()
abstract class DailySummaryToday implements Built<DailySummaryToday, DailySummaryTodayBuilder> {
  @BuiltValueField(wireName: r'digestDate')
  String get digestDate;

  @BuiltValueField(wireName: r'kind')
  DailySummaryTodayKindEnum get kind;
  // enum kindEnum {  full,  quota_only,  };

  @BuiltValueField(wireName: r'instruments')
  BuiltList<String> get instruments;

  @BuiltValueField(wireName: r'summary')
  String get summary;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'analyses')
  BuiltList<DailySummaryAnalysis> get analyses;

  DailySummaryToday._();

  factory DailySummaryToday([void updates(DailySummaryTodayBuilder b)]) = _$DailySummaryToday;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DailySummaryTodayBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DailySummaryToday> get serializer => _$DailySummaryTodaySerializer();
}

class _$DailySummaryTodaySerializer implements PrimitiveSerializer<DailySummaryToday> {
  @override
  final Iterable<Type> types = const [DailySummaryToday, _$DailySummaryToday];

  @override
  final String wireName = r'DailySummaryToday';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DailySummaryToday object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'digestDate';
    yield serializers.serialize(
      object.digestDate,
      specifiedType: const FullType(String),
    );
    yield r'kind';
    yield serializers.serialize(
      object.kind,
      specifiedType: const FullType(DailySummaryTodayKindEnum),
    );
    yield r'instruments';
    yield serializers.serialize(
      object.instruments,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'summary';
    yield serializers.serialize(
      object.summary,
      specifiedType: const FullType(String),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'analyses';
    yield serializers.serialize(
      object.analyses,
      specifiedType: const FullType(BuiltList, [FullType(DailySummaryAnalysis)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DailySummaryToday object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DailySummaryTodayBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'digestDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.digestDate = valueDes;
          break;
        case r'kind':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DailySummaryTodayKindEnum),
          ) as DailySummaryTodayKindEnum;
          result.kind = valueDes;
          break;
        case r'instruments':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.instruments.replace(valueDes);
          break;
        case r'summary':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.summary = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        case r'analyses':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(DailySummaryAnalysis)]),
          ) as BuiltList<DailySummaryAnalysis>;
          result.analyses.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DailySummaryToday deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DailySummaryTodayBuilder();
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

class DailySummaryTodayKindEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'full')
  static const DailySummaryTodayKindEnum full = _$dailySummaryTodayKindEnum_full;
  @BuiltValueEnumConst(wireName: r'quota_only')
  static const DailySummaryTodayKindEnum quotaOnly = _$dailySummaryTodayKindEnum_quotaOnly;

  static Serializer<DailySummaryTodayKindEnum> get serializer => _$dailySummaryTodayKindEnumSerializer;

  const DailySummaryTodayKindEnum._(String name): super(name);

  static BuiltSet<DailySummaryTodayKindEnum> get values => _$dailySummaryTodayKindEnumValues;
  static DailySummaryTodayKindEnum valueOf(String name) => _$dailySummaryTodayKindEnumValueOf(name);
}

