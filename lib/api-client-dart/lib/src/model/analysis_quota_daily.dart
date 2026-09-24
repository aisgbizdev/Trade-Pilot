//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_quota_daily.g.dart';

/// AnalysisQuotaDaily
///
/// Properties:
/// * [limit] 
/// * [used] 
/// * [remaining] 
@BuiltValue()
abstract class AnalysisQuotaDaily implements Built<AnalysisQuotaDaily, AnalysisQuotaDailyBuilder> {
  @BuiltValueField(wireName: r'limit')
  int get limit;

  @BuiltValueField(wireName: r'used')
  int get used;

  @BuiltValueField(wireName: r'remaining')
  int get remaining;

  AnalysisQuotaDaily._();

  factory AnalysisQuotaDaily([void updates(AnalysisQuotaDailyBuilder b)]) = _$AnalysisQuotaDaily;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysisQuotaDailyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisQuotaDaily> get serializer => _$AnalysisQuotaDailySerializer();
}

class _$AnalysisQuotaDailySerializer implements PrimitiveSerializer<AnalysisQuotaDaily> {
  @override
  final Iterable<Type> types = const [AnalysisQuotaDaily, _$AnalysisQuotaDaily];

  @override
  final String wireName = r'AnalysisQuotaDaily';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisQuotaDaily object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'limit';
    yield serializers.serialize(
      object.limit,
      specifiedType: const FullType(int),
    );
    yield r'used';
    yield serializers.serialize(
      object.used,
      specifiedType: const FullType(int),
    );
    yield r'remaining';
    yield serializers.serialize(
      object.remaining,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisQuotaDaily object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisQuotaDailyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'limit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.limit = valueDes;
          break;
        case r'used':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.used = valueDes;
          break;
        case r'remaining':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.remaining = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysisQuotaDaily deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysisQuotaDailyBuilder();
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

