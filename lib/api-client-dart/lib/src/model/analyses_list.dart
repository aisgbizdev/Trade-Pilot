//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/analysis.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analyses_list.g.dart';

/// AnalysesList
///
/// Properties:
/// * [analyses] 
/// * [total] 
/// * [page] 
/// * [limit] 
@BuiltValue()
abstract class AnalysesList implements Built<AnalysesList, AnalysesListBuilder> {
  @BuiltValueField(wireName: r'analyses')
  BuiltList<Analysis> get analyses;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'page')
  int get page;

  @BuiltValueField(wireName: r'limit')
  int get limit;

  AnalysesList._();

  factory AnalysesList([void updates(AnalysesListBuilder b)]) = _$AnalysesList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysesListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysesList> get serializer => _$AnalysesListSerializer();
}

class _$AnalysesListSerializer implements PrimitiveSerializer<AnalysesList> {
  @override
  final Iterable<Type> types = const [AnalysesList, _$AnalysesList];

  @override
  final String wireName = r'AnalysesList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysesList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'analyses';
    yield serializers.serialize(
      object.analyses,
      specifiedType: const FullType(BuiltList, [FullType(Analysis)]),
    );
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(int),
    );
    yield r'page';
    yield serializers.serialize(
      object.page,
      specifiedType: const FullType(int),
    );
    yield r'limit';
    yield serializers.serialize(
      object.limit,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysesList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysesListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'analyses':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(Analysis)]),
          ) as BuiltList<Analysis>;
          result.analyses.replace(valueDes);
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.total = valueDes;
          break;
        case r'page':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.page = valueDes;
          break;
        case r'limit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.limit = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysesList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysesListBuilder();
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

